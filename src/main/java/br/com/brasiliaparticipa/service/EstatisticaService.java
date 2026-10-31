package br.com.brasiliaparticipa.service;

import br.com.brasiliaparticipa.dto.EstatisticasResponse;
import br.com.brasiliaparticipa.dto.EstatisticasResponse.Contagem;
import br.com.brasiliaparticipa.dto.EstatisticasResponse.RankingRegiao;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.Perfil;
import br.com.brasiliaparticipa.model.StatusDemanda;
import br.com.brasiliaparticipa.repository.UsuarioRepository;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

/**
 * Indicadores do dashboard. Os agrupamentos (por status, categoria e região) são
 * feitos pelo próprio MongoDB com o Aggregation Framework ($group), que é bem mais
 * rápido do que trazer todas as demandas para o Java e contar uma por uma.
 */
@Service
public class EstatisticaService {

    private static final ZoneId FUSO_BRASILIA = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter MES = DateTimeFormatter.ofPattern("MMM/yy", Locale.of("pt", "BR"));

    private final MongoTemplate mongoTemplate;
    private final UsuarioRepository usuarioRepository;

    public EstatisticaService(MongoTemplate mongoTemplate, UsuarioRepository usuarioRepository) {
        this.mongoTemplate = mongoTemplate;
        this.usuarioRepository = usuarioRepository;
    }

    public EstatisticasResponse calcular() {
        Map<String, Long> porStatusMapa = contarPor("status");
        List<Contagem> porStatus = Arrays.stream(StatusDemanda.values())
                .map(s -> new Contagem(s.getTexto(), porStatusMapa.getOrDefault(s.name(), 0L)))
                .toList();

        long total = porStatusMapa.values().stream().mapToLong(Long::longValue).sum();
        long resolvidas = porStatusMapa.getOrDefault(StatusDemanda.RESOLVIDA.name(), 0L);
        long recebidas = porStatusMapa.getOrDefault(StatusDemanda.RECEBIDA.name(), 0L);
        long emAndamento = porStatusMapa.getOrDefault(StatusDemanda.EM_ANALISE.name(), 0L)
                + porStatusMapa.getOrDefault(StatusDemanda.PENDENTE.name(), 0L);

        List<Contagem> porCategoria = contarPor("categoria").entrySet().stream()
                .map(e -> new Contagem(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.total(), a.total()))
                .toList();

        List<RankingRegiao> porRegiao = rankingRegioes();
        long totalApoios = porRegiao.stream().mapToLong(RankingRegiao::apoios).sum();

        return new EstatisticasResponse(
                total,
                resolvidas,
                emAndamento,
                recebidas,
                totalApoios,
                porRegiao.size(),
                usuarioRepository.countByPerfil(Perfil.CIDADAO),
                tempoMedioResolucaoDias(),
                total == 0 ? 0 : Math.round(resolvidas * 1000.0 / total) / 10.0,
                porStatus,
                porCategoria,
                porRegiao,
                porMes()
        );
    }

    /** db.demandas.aggregate([{ $group: { _id: "$campo", total: { $sum: 1 } } }]) */
    private Map<String, Long> contarPor(String campo) {
        Aggregation agregacao = newAggregation(group(campo).count().as("total"));
        return mongoTemplate.aggregate(agregacao, Demanda.class, Document.class).getMappedResults().stream()
                .filter(d -> d.get("_id") != null)
                .collect(Collectors.toMap(d -> d.get("_id").toString(), d -> ((Number) d.get("total")).longValue()));
    }

    /** Por região: total de demandas, quantas foram resolvidas e quantos apoios recebeu. */
    private List<RankingRegiao> rankingRegioes() {
        Aggregation agregacao = newAggregation(
                group("regiao")
                        .count().as("total")
                        .sum("totalApoios").as("apoios")
                        .sum(ConditionalOperators.when(Criteria.where("status").is(StatusDemanda.RESOLVIDA.name()))
                                .then(1).otherwise(0)).as("resolvidas"),
                sort(Sort.by(Sort.Order.desc("total"), Sort.Order.desc("apoios")))
        );
        return mongoTemplate.aggregate(agregacao, Demanda.class, Document.class).getMappedResults().stream()
                .map(d -> new RankingRegiao(
                        String.valueOf(d.get("_id")),
                        ((Number) d.get("total")).longValue(),
                        ((Number) d.get("resolvidas")).longValue(),
                        ((Number) d.get("apoios")).longValue()))
                .toList();
    }

    /** Média de dias entre o registro e a resolução. null se nada foi resolvido ainda. */
    private Double tempoMedioResolucaoDias() {
        Query query = Query.query(Criteria.where("status").is(StatusDemanda.RESOLVIDA).and("resolvidaEm").ne(null));
        query.fields().include("criadaEm", "resolvidaEm");
        List<Demanda> resolvidas = mongoTemplate.find(query, Demanda.class);
        if (resolvidas.isEmpty()) return null;
        double media = resolvidas.stream()
                .mapToLong(d -> Duration.between(d.getCriadaEm(), d.getResolvidaEm()).toHours())
                .average().orElse(0) / 24.0;
        return Math.round(media * 10) / 10.0;
    }

    /** Quantas demandas foram registradas em cada um dos últimos 6 meses. */
    private List<Contagem> porMes() {
        YearMonth atual = YearMonth.now(FUSO_BRASILIA);
        YearMonth inicio = atual.minusMonths(5);
        Instant desde = inicio.atDay(1).atStartOfDay(FUSO_BRASILIA).toInstant();

        Query query = Query.query(Criteria.where("criadaEm").gte(desde));
        query.fields().include("criadaEm");
        Map<YearMonth, Long> contagem = mongoTemplate.find(query, Demanda.class).stream()
                .collect(Collectors.groupingBy(d -> YearMonth.from(d.getCriadaEm().atZone(FUSO_BRASILIA)),
                        TreeMap::new, Collectors.counting()));

        List<Contagem> meses = new ArrayList<>();
        for (YearMonth mes = inicio; !mes.isAfter(atual); mes = mes.plusMonths(1)) {
            meses.add(new Contagem(mes.format(MES), contagem.getOrDefault(mes, 0L)));
        }
        return meses;
    }
}
