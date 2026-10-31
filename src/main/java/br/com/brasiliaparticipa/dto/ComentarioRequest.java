package br.com.brasiliaparticipa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ComentarioRequest(
        @NotBlank(message = "Escreva o comentário")
        @Size(max = 1000, message = "O comentário deve ter no máximo 1000 caracteres")
        String texto
) {
}
