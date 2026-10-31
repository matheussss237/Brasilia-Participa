package br.com.brasiliaparticipa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Ponto de entrada do sistema.
 * <p>
 * Rode esta classe no IntelliJ (botão verde ▶) e acesse http://localhost:8080.
 * O mesmo servidor entrega o site (pasta resources/static) e a API (/api/...).
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class BrasiliaParticipaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrasiliaParticipaApplication.class, args);
    }
}
