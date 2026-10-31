package br.com.brasiliaparticipa.dto;

import java.util.List;

/** Números da home e do dashboard. */
public record EstatisticasResponse(
        long total,
        long resolvidas,
        long emAndamento,
        long recebidas,
        long totalApoios,
        long regioesAtendidas,
        long cidadaos,
        Double tempoMedioResolucaoDias,
        double taxaResolucao,
        List<Contagem> porStatus,
        List<Contagem> porCategoria,
        List<RankingRegiao> porRegiao,
        List<Contagem> porMes
) {

    public record Contagem(String nome, long total) {
    }

    public record RankingRegiao(String regiao, long total, long resolvidas, long apoios) {
    }
}
