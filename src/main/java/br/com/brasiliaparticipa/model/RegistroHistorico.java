package br.com.brasiliaparticipa.model;

import java.time.Instant;

/**
 * Uma linha da "linha do tempo" da demanda: cada mudança de status fica registrada
 * com quem fez, quando e por quê. Fica guardada dentro do próprio documento da demanda.
 */
public record RegistroHistorico(
        StatusDemanda status,
        String observacao,
        String responsavel,
        Instant data
) {
}
