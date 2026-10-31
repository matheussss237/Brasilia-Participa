package br.com.brasiliaparticipa.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Lê as chaves app.dados-iniciais.* do application.properties. */
@ConfigurationProperties(prefix = "app.dados-iniciais")
public record DadosIniciaisProperties(
        boolean ativo,
        String adminEmail,
        String adminSenha,
        String cidadaoEmail,
        String cidadaoSenha
) {
}
