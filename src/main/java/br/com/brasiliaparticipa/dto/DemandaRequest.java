package br.com.brasiliaparticipa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Dados que o formulário "Nova demanda" envia. A foto vai separada (multipart). */
public record DemandaRequest(
        @NotBlank(message = "Informe um título")
        @Size(min = 5, max = 120, message = "O título deve ter entre 5 e 120 caracteres")
        String titulo,

        @NotBlank(message = "Descreva o problema")
        @Size(min = 10, max = 2000, message = "A descrição deve ter entre 10 e 2000 caracteres")
        String descricao,

        @NotBlank(message = "Escolha uma categoria")
        String categoria,

        @NotBlank(message = "Escolha a região administrativa")
        String regiao,

        @NotBlank(message = "Informe o endereço ou um ponto de referência")
        @Size(max = 200, message = "O endereço deve ter no máximo 200 caracteres")
        String endereco,

        /* Opcionais: se o cidadão não clicar no mapa, usamos o centro da região. */
        Double latitude,
        Double longitude
) {
}
