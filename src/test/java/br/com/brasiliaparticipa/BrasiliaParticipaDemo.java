package br.com.brasiliaparticipa;

import org.springframework.boot.SpringApplication;

/**
 * MODO DEMONSTRAÇÃO: roda o sistema com um MongoDB em memória, sem instalar nada.
 * <p>
 * No IntelliJ: clique no ▶ ao lado do main abaixo.
 * No terminal: {@code ./mvnw spring-boot:test-run}
 * <p>
 * Os dados são apagados quando o sistema para. Para o projeto "de verdade",
 * rode a classe BrasiliaParticipaApplication com o MongoDB ligado.
 */
public class BrasiliaParticipaDemo {

    public static void main(String[] args) {
        SpringApplication.from(BrasiliaParticipaApplication::main)
                .with(MongoEmbutidoConfig.class)
                .run(args);
    }
}
