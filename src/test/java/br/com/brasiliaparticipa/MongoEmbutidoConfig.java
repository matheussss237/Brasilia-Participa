package br.com.brasiliaparticipa;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.net.InetSocketAddress;

/**
 * Sobe um "MongoDB de mentira" em memória (biblioteca mongo-java-server).
 * Usado nos testes e no modo demonstração (BrasiliaParticipaDemo), para rodar
 * o projeto sem precisar instalar o MongoDB. Os dados somem quando o app para.
 */
@TestConfiguration(proxyBeanMethods = false)
public class MongoEmbutidoConfig {

    @Bean(destroyMethod = "shutdown")
    public MongoServer mongoServer() {
        MongoServer servidor = new MongoServer(new MemoryBackend());
        servidor.bind();
        return servidor;
    }

    @Bean(destroyMethod = "close")
    public MongoClient mongoClient(MongoServer servidor) {
        InetSocketAddress endereco = servidor.getLocalAddress();
        return MongoClients.create("mongodb://" + endereco.getHostString() + ":" + endereco.getPort());
    }
}
