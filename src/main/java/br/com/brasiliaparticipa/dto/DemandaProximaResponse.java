package br.com.brasiliaparticipa.dto;

/** Demanda parecida encontrada perto do ponto que o cidadão marcou. */
public record DemandaProximaResponse(DemandaResponse demanda, int distanciaMetros) {
}
