package br.com.brasiliaparticipa.dto;

import br.com.brasiliaparticipa.model.StatusDemanda;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Usado pelo administrador para mover a demanda de etapa. */
public record AlterarStatusRequest(
        @NotNull(message = "Escolha o novo status")
        StatusDemanda status,

        @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres")
        String observacao
) {
}
