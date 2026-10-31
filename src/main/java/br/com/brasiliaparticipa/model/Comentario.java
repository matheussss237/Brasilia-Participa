package br.com.brasiliaparticipa.model;

import java.time.Instant;

/**
 * Comentário em uma demanda. Quando quem comenta é um administrador,
 * o comentário é marcado como "oficial" (resposta do governo).
 */
public record Comentario(
        String id,
        String autorId,
        String autorNome,
        String texto,
        boolean oficial,
        Instant data
) {
}
