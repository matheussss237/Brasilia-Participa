package br.com.brasiliaparticipa.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Título e descrição da documentação em http://localhost:8080/swagger-ui.html */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI documentacao() {
        return new OpenAPI().info(new Info()
                .title("Brasília Participa — API")
                .version("1.0.0")
                .description("API REST do portal de participação cidadã do Distrito Federal. "
                        + "Projeto Integrador — Engenharia de Software, UniCEPLAC."));
    }
}
