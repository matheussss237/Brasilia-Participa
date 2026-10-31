package br.com.brasiliaparticipa.dto;

import br.com.brasiliaparticipa.model.Demanda;

import java.time.Instant;

/** Como uma demanda aparece nas listas, no mapa e nos cards. */
public record DemandaResponse(
        String id,
        String titulo,
        String descricao,
        String categoria,
        String regiao,
        String endereco,
        double latitude,
        double longitude,
        String status,
        String statusTexto,
        String fotoUrl,
        String autorNome,
        int totalApoios,
        boolean apoiadaPorMim,
        int totalComentarios,
        Instant criadaEm,
        Instant atualizadaEm
) {

    /** @param usuarioId quem está vendo (null se não estiver logado) */
    public static DemandaResponse de(Demanda d, String usuarioId) {
        return new DemandaResponse(
                d.getId(),
                d.getTitulo(),
                d.getDescricao(),
                d.getCategoria(),
                d.getRegiao(),
                d.getEndereco(),
                d.getLatitude(),
                d.getLongitude(),
                d.getStatus().name(),
                d.getStatus().getTexto(),
                d.getFotoUrl(),
                d.getAutorNome(),
                d.getTotalApoios(),
                usuarioId != null && d.getApoiadores().contains(usuarioId),
                d.getComentarios().size(),
                d.getCriadaEm(),
                d.getAtualizadaEm()
        );
    }
}
