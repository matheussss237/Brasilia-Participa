package br.com.brasiliaparticipa.repository;

import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.StatusDemanda;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Consultas simples ficam aqui (o Spring gera a query pelo nome do método).
 * Consultas com filtros combinados ficam no DemandaService, usando MongoTemplate.
 */
public interface DemandaRepository extends MongoRepository<Demanda, String> {

    List<Demanda> findByAutorId(String autorId);

    long countByAutorId(String autorId);

    long countByAutorIdAndStatus(String autorId, StatusDemanda status);

    long countByApoiadoresContains(String usuarioId);

    long countByStatus(StatusDemanda status);
}
