package br.com.brasiliaparticipa.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Formato padrão de erro da API. O front mostra "mensagem" num aviso e
 * usa "campos" para destacar cada campo inválido do formulário.
 */
public record ErroResponse(int status, String erro, String mensagem, Map<String, String> campos, Instant data) {

    public ErroResponse(int status, String erro, String mensagem) {
        this(status, erro, mensagem, Map.of(), Instant.now());
    }
}
