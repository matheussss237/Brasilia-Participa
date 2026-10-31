package br.com.brasiliaparticipa.config;

import br.com.brasiliaparticipa.model.Comentario;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.Perfil;
import br.com.brasiliaparticipa.model.RegistroHistorico;
import br.com.brasiliaparticipa.model.StatusDemanda;
import br.com.brasiliaparticipa.model.Usuario;
import br.com.brasiliaparticipa.repository.DemandaRepository;
import br.com.brasiliaparticipa.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static br.com.brasiliaparticipa.model.StatusDemanda.EM_ANALISE;
import static br.com.brasiliaparticipa.model.StatusDemanda.PENDENTE;
import static br.com.brasiliaparticipa.model.StatusDemanda.RECEBIDA;
import static br.com.brasiliaparticipa.model.StatusDemanda.RESOLVIDA;

/**
 * Roda uma vez quando o sistema sobe. Se o banco estiver vazio, cria:
 * <ul>
 *   <li>um usuário ADMIN e um CIDADÃO de exemplo (para testar e apresentar);</li>
 *   <li>as 22 demandas de exemplo que já existiam no front-end antigo.</li>
 * </ul>
 * As datas são relativas a "hoje", então o site sempre parece atualizado na apresentação.
 */
@Component
public class DadosIniciais implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DadosIniciais.class);

    private final DadosIniciaisProperties propriedades;
    private final UsuarioService usuarioService;
    private final DemandaRepository demandaRepository;

    public DadosIniciais(DadosIniciaisProperties propriedades, UsuarioService usuarioService,
                         DemandaRepository demandaRepository) {
        this.propriedades = propriedades;
        this.usuarioService = usuarioService;
        this.demandaRepository = demandaRepository;
    }

    /** Uma demanda de exemplo. diasAtras = há quantos dias foi registrada. */
    private record Exemplo(String titulo, String descricao, String categoria, String regiao, String endereco,
                           StatusDemanda status, int apoios, int diasAtras, String foto,
                           double lat, double lng, boolean doCidadaoExemplo) {
    }

    private static final List<Exemplo> EXEMPLOS = List.of(
            new Exemplo("Buraco na Avenida Principal do Gama",
                    "O asfalto está danificado próximo ao ponto de ônibus e dificulta a passagem dos veículos.",
                    "Infraestrutura", "Gama", "Avenida Principal, próximo ao ponto de ônibus",
                    EM_ANALISE, 24, 9, "/imagens/BuracoGama.jpg", -16.0206, -48.0611, true),
            new Exemplo("Poste apagado na quadra 12",
                    "Moradores relatam que o poste está apagado na quadra 12 e dificulta a passagem durante a noite.",
                    "Iluminação", "Taguatinga", "Quadra 12",
                    RESOLVIDA, 38, 46, "/imagens/iluminacao-taguatinga.png", -15.8309, -48.0512, false),
            new Exemplo("Acúmulo de lixo próximo à praça",
                    "Há alguns dias o local não recebe coleta e o lixo está ocupando parte da calçada.",
                    "Limpeza", "Ceilândia", "Praça central",
                    RECEBIDA, 17, 3, "/imagens/coleta-ceilandia.png", -15.8173, -48.1064, false),
            new Exemplo("Árvores caídas após temporal",
                    "Uma árvore caiu após as últimas fortes tempestades e está bloqueando parte da via.",
                    "Meio ambiente", "Samambaia", "Via de acesso à quadra",
                    PENDENTE, 31, 12, "/imagens/area-verde-samambaia.jpg", -15.8781, -48.0862, false),
            new Exemplo("Redução do policiamento durante a noite",
                    "Falta de policiamento nas ruas da região durante o período noturno.",
                    "Segurança", "Ceilândia", "Setor central",
                    EM_ANALISE, 17, 15, null, -15.8110, -48.1132, false),
            new Exemplo("Falta de professores na escola",
                    "A escola está enfrentando falta de professores em algumas disciplinas, prejudicando o aprendizado dos alunos.",
                    "Educação", "Planaltina", "Escola da região",
                    PENDENTE, 9, 38, null, -15.6241, -47.6498, false),
            new Exemplo("Semáforo quebrado na Avenida das Araucárias",
                    "O semáforo está apagado há uma semana e o cruzamento ficou perigoso no horário de pico.",
                    "Transporte", "Águas Claras", "Avenida das Araucárias, próximo ao metrô",
                    RESOLVIDA, 52, 70, "/imagens/semaforo-aguas-claras.png", -15.8355, -48.0257, false),
            new Exemplo("Vazamento de esgoto a céu aberto",
                    "Vazamento próximo à quadra comercial causando mau cheiro e risco à saúde dos moradores.",
                    "Saúde", "Guará", "QE 24, área comercial",
                    RESOLVIDA, 67, 95, "/imagens/esgoto-guara.png", -15.8231, -47.9739, false),
            new Exemplo("Calçada sem acessibilidade para cadeirantes",
                    "Falta rampa de acesso na esquina principal, dificultando a locomoção de cadeirantes e idosos.",
                    "Acessibilidade", "Santa Maria", "Quadra 116, esquina com a via principal",
                    EM_ANALISE, 29, 20, "/imagens/calcada-santa-maria.png", -16.0159, -48.0033, true),
            new Exemplo("Terreno baldio usado como depósito de entulho",
                    "Moradores denunciam descarte irregular de entulho e lixo em terreno baldio há meses.",
                    "Limpeza", "Recanto das Emas", "Quadra 400, próximo à quadra de esportes",
                    PENDENTE, 21, 6, "/imagens/lixo-recanto-emas.png", -15.9088, -48.0610, false),
            new Exemplo("Cratera na via após obra da concessionária",
                    "Após reparo no encanamento, a rua ficou com uma cratera que não foi recoberta corretamente.",
                    "Infraestrutura", "Sobradinho", "Quadra 6, via principal",
                    RESOLVIDA, 44, 120, null, -15.6534, -47.7825, false),
            new Exemplo("Ponto de ônibus sem cobertura",
                    "O ponto de ônibus principal não tem cobertura, deixando os passageiros expostos ao sol e à chuva.",
                    "Transporte", "São Sebastião", "Entrada principal, próximo ao comércio local",
                    RECEBIDA, 13, 2, "/imagens/onibus-sao-sebastiao.png", -15.9011, -47.7716, true),
            new Exemplo("Trecho da ciclovia sem iluminação",
                    "Trecho da ciclovia próximo ao lago fica completamente escuro à noite, gerando insegurança.",
                    "Iluminação", "Plano Piloto", "Ciclovia próxima à orla do lago",
                    RESOLVIDA, 58, 150, "/imagens/iluminacao-plano-piloto.png", -15.7889, -47.8631, false),
            new Exemplo("Câmeras de segurança fora de funcionamento",
                    "As câmeras da praça central estão desligadas há mais de um mês, segundo relatos de comerciantes.",
                    "Segurança", "Taguatinga", "Praça do Rotary",
                    EM_ANALISE, 19, 5, null, -15.8365, -48.0602, false),
            new Exemplo("Estrada de terra esburacada dificulta escoamento rural",
                    "Produtores rurais relatam dificuldade para escoar a produção devido às condições da estrada após as chuvas.",
                    "Infraestrutura", "Brazlândia", "Núcleo Rural, estrada de acesso às chácaras",
                    PENDENTE, 15, 52, "/imagens/estrada-brazlandia.png", -15.6672, -48.1998, false),
            new Exemplo("Falta de coleta seletiva de recicláveis",
                    "O bairro não conta com coleta seletiva regular, e os moradores precisam levar o material reciclável para outras regiões.",
                    "Limpeza", "Paranoá", "Setor de habitações coletivas",
                    RECEBIDA, 11, 1, null, -15.7768, -47.7622, false),
            new Exemplo("Sinalização de trânsito apagada na via principal",
                    "As faixas de pedestre e a sinalização horizontal estão praticamente apagadas, aumentando o risco de acidentes.",
                    "Transporte", "Núcleo Bandeirante", "Via principal, próximo ao comércio",
                    EM_ANALISE, 22, 27, "/imagens/sinalizacao-nucleo-bandeirante.png", -15.8703, -47.9652, false),
            new Exemplo("Vazamento de água na rede pública há dias",
                    "Um vazamento na tubulação está desperdiçando água potável e formando um alagamento na via há mais de uma semana.",
                    "Infraestrutura", "Lago Sul", "Quadra residencial próxima à orla",
                    RESOLVIDA, 34, 33, null, -15.8309, -47.8452, false),
            new Exemplo("Unidade de saúde sem médico plantonista à noite",
                    "A UBS da região não conta com plantão noturno, obrigando moradores a se deslocarem para outras cidades em emergências.",
                    "Saúde", "Riacho Fundo", "UBS local",
                    PENDENTE, 41, 64, "/imagens/saude-riacho-fundo.png", -15.8852, -48.0141, false),
            new Exemplo("Ciclovia interrompida por obra parada",
                    "A obra de ampliação da ciclovia está parada há meses, forçando ciclistas a dividir a pista com carros.",
                    "Transporte", "Vicente Pires", "Trecho 3, próximo à via estrutural",
                    EM_ANALISE, 27, 88, "/imagens/ciclovia-vicente-pires.png", -15.8241, -47.9986, false),
            new Exemplo("Falta de rede de esgoto em parte do bairro",
                    "Diversas quadras ainda não têm rede de esgoto, e o descarte irregular está contaminando um córrego próximo.",
                    "Saúde", "Sol Nascente/Pôr do Sol", "Setor Sol Nascente, quadras finais",
                    RECEBIDA, 36, 0, "/imagens/esgoto-sol-nascente.png", -15.8102, -48.1412, false),
            new Exemplo("Praça pública sem manutenção e brinquedos quebrados",
                    "Os brinquedos do parquinho estão quebrados há meses e o mato alto tomou conta da praça, que ficou sem uso.",
                    "Meio ambiente", "Itapoã", "Praça central do setor habitacional",
                    RESOLVIDA, 25, 22, "/imagens/praca-itapoa.png", -15.7341, -47.7481, true)
    );

    @Override
    public void run(ApplicationArguments args) {
        if (!propriedades.ativo()) {
            return;
        }

        usuarioService.garantirUsuario("Administração GDF", propriedades.adminEmail(),
                propriedades.adminSenha(), Perfil.ADMIN);
        Usuario cidadao = usuarioService.garantirUsuario("Cidadão de Exemplo", propriedades.cidadaoEmail(),
                propriedades.cidadaoSenha(), Perfil.CIDADAO);

        if (demandaRepository.count() > 0) {
            return;
        }

        Instant agora = Instant.now();
        List<Demanda> demandas = EXEMPLOS.stream().map(e -> criarDemanda(e, cidadao, agora)).toList();
        demandaRepository.saveAll(demandas);

        log.info("Banco vazio: {} demandas de exemplo criadas.", demandas.size());
        log.info("Login ADMIN: {} | Login CIDADAO: {}", propriedades.adminEmail(), propriedades.cidadaoEmail());
    }

    private static Demanda criarDemanda(Exemplo e, Usuario cidadao, Instant agora) {
        Instant criadaEm = agora.minus(Duration.ofDays(e.diasAtras())).minus(Duration.ofHours(3 + e.apoios() % 9));
        String orgao = "Administração Regional — " + e.regiao();

        Demanda d = new Demanda();
        d.setTitulo(e.titulo());
        d.setDescricao(e.descricao());
        d.setCategoria(e.categoria());
        d.setRegiao(e.regiao());
        d.setEndereco(e.endereco());
        d.setLatitude(e.lat());
        d.setLongitude(e.lng());
        d.setFotoUrl(e.foto());
        d.setTotalApoios(e.apoios());
        d.setStatus(e.status());
        d.setCriadaEm(criadaEm);
        if (e.doCidadaoExemplo()) {
            d.setAutorId(cidadao.getId());
            d.setAutorNome(cidadao.getNome());
        } else {
            d.setAutorNome("Morador(a) de " + e.regiao());
        }

        // Linha do tempo coerente com o status atual
        d.getHistorico().add(new RegistroHistorico(RECEBIDA, "Demanda registrada pelo cidadão.",
                d.getAutorNome(), criadaEm));
        Instant ultima = criadaEm;
        if (e.status() != RECEBIDA) {
            ultima = depois(criadaEm, Math.min(2, e.diasAtras()), agora);
            d.getHistorico().add(new RegistroHistorico(EM_ANALISE,
                    "Equipe técnica encaminhada para vistoria no local.", orgao, ultima));
        }
        if (e.status() == PENDENTE) {
            ultima = depois(criadaEm, Math.min(5, e.diasAtras()), agora);
            d.getHistorico().add(new RegistroHistorico(PENDENTE,
                    "Aguardando liberação de equipe e material para execução do serviço.", orgao, ultima));
        }
        if (e.status() == RESOLVIDA) {
            ultima = depois(criadaEm, Math.min(4 + e.apoios() % 10, e.diasAtras()), agora);
            d.getHistorico().add(new RegistroHistorico(RESOLVIDA,
                    "Serviço concluído pela equipe responsável.", orgao, ultima));
            d.setResolvidaEm(ultima);
            d.getComentarios().add(new Comentario(UUID.randomUUID().toString(), null, orgao,
                    "A equipe esteve no local e concluiu o serviço. Obrigado por participar!", true, ultima));
        }
        d.setAtualizadaEm(ultima);
        return d;
    }

    private static Instant depois(Instant inicio, int dias, Instant limite) {
        Instant data = inicio.plus(Duration.ofDays(dias)).plus(Duration.ofHours(2));
        return data.isAfter(limite) ? limite : data;
    }
}
