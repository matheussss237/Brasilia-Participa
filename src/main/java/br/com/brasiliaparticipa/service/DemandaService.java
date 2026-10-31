package br.com.brasiliaparticipa.service;

import br.com.brasiliaparticipa.dto.AlterarStatusRequest;
import br.com.brasiliaparticipa.dto.ApoioResponse;
import br.com.brasiliaparticipa.dto.DemandaProximaResponse;
import br.com.brasiliaparticipa.dto.DemandaRequest;
import br.com.brasiliaparticipa.dto.DemandaResponse;
import br.com.brasiliaparticipa.dto.PaginaResponse;
import br.com.brasiliaparticipa.exception.RecursoNaoEncontradoException;
import br.com.brasiliaparticipa.exception.RegraNegocioException;
import br.com.brasiliaparticipa.model.Comentario;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.Referencias;
import br.com.brasiliaparticipa.model.RegistroHistorico;
import br.com.brasiliaparticipa.model.StatusDemanda;
import br.com.brasiliaparticipa.repository.DemandaRepository;
import br.com.brasiliaparticipa.security.UsuarioLogado;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

/** Regras de negócio das demandas. Os controllers só recebem a requisição e chamam este service. */
@Service
public class DemandaService {

    /** Raio (em metros) para considerar que duas demandas são "do mesmo lugar". */
    public static final int RAIO_PROXIMIDADE_METROS = 300;

    private static final int TAMANHO_MAXIMO_PAGINA = 500;

    private final DemandaRepository demandaRepository;
    private final MongoTemplate mongoTemplate;
    private final FotoService fotoService;

    public DemandaService(DemandaRepository demandaRepository, MongoTemplate mongoTemplate, FotoService fotoService) {
        this.demandaRepository = demandaRepository;
        this.mongoTemplate = mongoTemplate;
        this.fotoService = fotoService;
    }

    // ------------------------------------------------------------------ consultas

    public PaginaResponse<DemandaResponse> listar(FiltroDemandas filtro, int pagina, int tamanho, String usuarioId) {
        pagina = Math.max(0, pagina);
        tamanho = Math.clamp(tamanho, 1, TAMANHO_MAXIMO_PAGINA);

        Query query = new Query();
        if (filtro.status() != null) query.addCriteria(Criteria.where("status").is(filtro.status()));
        if (StringUtils.hasText(filtro.categoria())) query.addCriteria(Criteria.where("categoria").is(filtro.categoria()));
        if (StringUtils.hasText(filtro.regiao())) query.addCriteria(Criteria.where("regiao").is(filtro.regiao()));
        if (StringUtils.hasText(filtro.autorId())) query.addCriteria(Criteria.where("autorId").is(filtro.autorId()));
        if (StringUtils.hasText(filtro.texto())) {
            // Pattern.quote: o que o usuário digita é tratado como texto, nunca como expressão regular
            Pattern termo = Pattern.compile(Pattern.quote(filtro.texto().trim()),
                    Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("titulo").regex(termo),
                    Criteria.where("descricao").regex(termo),
                    Criteria.where("regiao").regex(termo),
                    Criteria.where("endereco").regex(termo)));
        }

        long total = mongoTemplate.count(query, Demanda.class);

        query.with(ordenacao(filtro.ordenar()))
                .skip((long) pagina * tamanho)
                .limit(tamanho);

        List<DemandaResponse> itens = mongoTemplate.find(query, Demanda.class).stream()
                .map(d -> DemandaResponse.de(d, usuarioId))
                .toList();

        boolean temMais = (long) (pagina + 1) * tamanho < total;
        return new PaginaResponse<>(itens, pagina, tamanho, total, temMais);
    }

    private static Sort ordenacao(String ordenar) {
        if ("apoios".equals(ordenar)) {
            return Sort.by(Sort.Order.desc("totalApoios"), Sort.Order.desc("criadaEm"));
        }
        if ("antigas".equals(ordenar)) {
            return Sort.by(Sort.Order.asc("criadaEm"));
        }
        return Sort.by(Sort.Order.desc("criadaEm"));
    }

    public Demanda buscar(String id) {
        return demandaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Demanda não encontrada."));
    }

    /**
     * Procura demandas ainda não resolvidas, da mesma categoria, a até 300 m do ponto.
     * Serve para avisar o cidadão "já existe uma demanda igual aqui perto, quer apoiar?"
     * e evitar duplicadas.
     */
    public List<DemandaProximaResponse> proximas(double latitude, double longitude, String categoria,
                                                 String usuarioId) {
        // 1) Filtro grosso no banco: um "quadrado" em volta do ponto (usa os índices)
        double deltaLat = RAIO_PROXIMIDADE_METROS / 111_320.0;
        double deltaLng = RAIO_PROXIMIDADE_METROS / (111_320.0 * Math.cos(Math.toRadians(latitude)));

        Query query = Query.query(Criteria.where("latitude").gte(latitude - deltaLat).lte(latitude + deltaLat)
                .and("longitude").gte(longitude - deltaLng).lte(longitude + deltaLng)
                .and("status").ne(StatusDemanda.RESOLVIDA));
        if (StringUtils.hasText(categoria)) {
            query.addCriteria(Criteria.where("categoria").is(categoria));
        }

        // 2) Filtro fino em Java: distância real em metros (fórmula de Haversine)
        return mongoTemplate.find(query, Demanda.class).stream()
                .map(d -> new DemandaProximaResponse(DemandaResponse.de(d, usuarioId),
                        (int) Math.round(distanciaMetros(latitude, longitude, d.getLatitude(), d.getLongitude()))))
                .filter(p -> p.distanciaMetros() <= RAIO_PROXIMIDADE_METROS)
                .sorted(Comparator.comparingInt(DemandaProximaResponse::distanciaMetros))
                .limit(5)
                .toList();
    }

    /** Distância entre dois pontos na superfície da Terra, em metros. */
    static double distanciaMetros(double lat1, double lng1, double lat2, double lng2) {
        double raioTerra = 6_371_000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return raioTerra * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ------------------------------------------------------------------ alterações

    public Demanda criar(DemandaRequest dados, MultipartFile foto, UsuarioLogado autor) {
        if (!Referencias.CATEGORIAS.contains(dados.categoria())) {
            throw new RegraNegocioException("Categoria inválida.");
        }
        Referencias.Coordenada centroRegiao = Referencias.REGIOES.get(dados.regiao());
        if (centroRegiao == null) {
            throw new RegraNegocioException("Região administrativa inválida.");
        }

        boolean marcouNoMapa = dados.latitude() != null && dados.longitude() != null;
        double latitude = marcouNoMapa ? dados.latitude() : centroRegiao.latitude();
        double longitude = marcouNoMapa ? dados.longitude() : centroRegiao.longitude();
        if (!Referencias.dentroDoDF(latitude, longitude)) {
            throw new RegraNegocioException("O ponto marcado no mapa precisa estar dentro do Distrito Federal.");
        }

        Demanda demanda = new Demanda();
        demanda.setTitulo(dados.titulo().trim());
        demanda.setDescricao(dados.descricao().trim());
        demanda.setCategoria(dados.categoria());
        demanda.setRegiao(dados.regiao());
        demanda.setEndereco(dados.endereco().trim());
        demanda.setLatitude(latitude);
        demanda.setLongitude(longitude);
        demanda.setAutorId(autor.getId());
        demanda.setAutorNome(autor.getNome());
        demanda.setStatus(StatusDemanda.RECEBIDA);
        demanda.getHistorico().add(new RegistroHistorico(StatusDemanda.RECEBIDA,
                "Demanda registrada pelo cidadão.", autor.getNome(), Instant.now()));

        if (foto != null && !foto.isEmpty()) {
            demanda.setFotoUrl(fotoService.salvar(foto));
        }

        return demandaRepository.save(demanda);
    }

    /**
     * Apoiar / remover apoio. Feito com UMA operação atômica no Mongo para não dar
     * problema se muita gente clicar ao mesmo tempo.
     */
    public ApoioResponse alternarApoio(String id, String usuarioId) {
        FindAndModifyOptions devolverAtualizado = FindAndModifyOptions.options().returnNew(true);

        // Tenta APOIAR: só acontece se o usuário ainda não estiver na lista
        Demanda apoiada = mongoTemplate.findAndModify(
                Query.query(Criteria.where("_id").is(id).and("apoiadores").ne(usuarioId)),
                new Update().addToSet("apoiadores", usuarioId).inc("totalApoios", 1),
                devolverAtualizado, Demanda.class);
        if (apoiada != null) {
            return new ApoioResponse(true, apoiada.getTotalApoios());
        }

        // Já tinha apoiado: REMOVE o apoio
        Demanda removida = mongoTemplate.findAndModify(
                Query.query(Criteria.where("_id").is(id).and("apoiadores").is(usuarioId)),
                new Update().pull("apoiadores", usuarioId).inc("totalApoios", -1),
                devolverAtualizado, Demanda.class);
        if (removida != null) {
            return new ApoioResponse(false, removida.getTotalApoios());
        }

        throw new RecursoNaoEncontradoException("Demanda não encontrada.");
    }

    public Comentario comentar(String id, String texto, UsuarioLogado autor) {
        Comentario comentario = new Comentario(UUID.randomUUID().toString(), autor.getId(), autor.getNome(),
                texto.trim(), autor.isAdmin(), Instant.now());

        var resultado = mongoTemplate.updateFirst(Query.query(Criteria.where("_id").is(id)),
                new Update().push("comentarios", comentario).set("atualizadaEm", Instant.now()),
                Demanda.class);
        if (resultado.getMatchedCount() == 0) {
            throw new RecursoNaoEncontradoException("Demanda não encontrada.");
        }
        return comentario;
    }

    /** Somente ADMIN (garantido no SecurityConfig). Registra a mudança na linha do tempo. */
    public Demanda alterarStatus(String id, AlterarStatusRequest dados, UsuarioLogado admin) {
        Demanda demanda = buscar(id);
        if (demanda.getStatus() == dados.status()) {
            throw new RegraNegocioException("A demanda já está com o status \"" + dados.status().getTexto() + "\".");
        }

        String observacao = StringUtils.hasText(dados.observacao())
                ? dados.observacao().trim()
                : "Status alterado para \"" + dados.status().getTexto() + "\".";

        Instant agora = Instant.now();
        demanda.setStatus(dados.status());
        demanda.setAtualizadaEm(agora);
        demanda.setResolvidaEm(dados.status() == StatusDemanda.RESOLVIDA ? agora : null);

        List<RegistroHistorico> historico = new ArrayList<>(demanda.getHistorico());
        historico.add(new RegistroHistorico(dados.status(), observacao, admin.getNome(), agora));
        demanda.setHistorico(historico);

        return demandaRepository.save(demanda);
    }

    public void excluir(String id) {
        Demanda demanda = buscar(id);
        demandaRepository.delete(demanda);
        fotoService.excluirSeEnviada(demanda.getFotoUrl());
    }
}
