package br.com.brasiliaparticipa.repository;

import br.com.brasiliaparticipa.model.Perfil;
import br.com.brasiliaparticipa.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/** O Spring cria a implementação sozinho a partir do nome dos métodos. */
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByPerfil(Perfil perfil);
}
