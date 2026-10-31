package br.com.brasiliaparticipa.service;

import br.com.brasiliaparticipa.dto.CadastroRequest;
import br.com.brasiliaparticipa.dto.PerfilResponse;
import br.com.brasiliaparticipa.dto.PerfilResponse.Conquista;
import br.com.brasiliaparticipa.dto.UsuarioResponse;
import br.com.brasiliaparticipa.exception.RecursoNaoEncontradoException;
import br.com.brasiliaparticipa.exception.RegraNegocioException;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.Perfil;
import br.com.brasiliaparticipa.model.StatusDemanda;
import br.com.brasiliaparticipa.model.Usuario;
import br.com.brasiliaparticipa.repository.DemandaRepository;
import br.com.brasiliaparticipa.repository.UsuarioRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final DemandaRepository demandaRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, DemandaRepository demandaRepository,
                          MongoTemplate mongoTemplate, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.demandaRepository = demandaRepository;
        this.mongoTemplate = mongoTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrar(CadastroRequest dados) {
        String email = dados.email().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmail(email)) {
            throw new RegraNegocioException(HttpStatus.CONFLICT, "Já existe uma conta com este e-mail.");
        }
        Usuario usuario = new Usuario(dados.nome().trim(), email,
                passwordEncoder.encode(dados.senha()), Perfil.CIDADAO);
        try {
            return usuarioRepository.save(usuario);
        } catch (DuplicateKeyException e) {
            // Duas pessoas cadastrando o mesmo e-mail ao mesmo tempo: o índice único do Mongo barra.
            throw new RegraNegocioException(HttpStatus.CONFLICT, "Já existe uma conta com este e-mail.");
        }
    }

    public PerfilResponse perfil(String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        long criadas = demandaRepository.countByAutorId(usuarioId);
        long resolvidas = demandaRepository.countByAutorIdAndStatus(usuarioId, StatusDemanda.RESOLVIDA);
        long apoios = demandaRepository.countByApoiadoresContains(usuarioId);
        long comentarios = mongoTemplate.count(
                Query.query(Criteria.where("comentarios.autorId").is(usuarioId)), Demanda.class);

        // Maior quantidade de demandas registradas numa mesma região (para a conquista "Guardião do Bairro")
        Map<String, Long> porRegiao = demandaRepository.findByAutorId(usuarioId).stream()
                .collect(Collectors.groupingBy(Demanda::getRegiao, Collectors.counting()));
        long maiorRegiao = porRegiao.values().stream().max(Long::compare).orElse(0L);

        List<Conquista> conquistas = List.of(
                conquista("Primeiro relato", "Registrou a primeira demanda", "fa-flag", criadas, 1),
                conquista("Colaborador Bronze", "Apoiou 5 demandas de outros cidadãos", "fa-medal", apoios, 5),
                conquista("Guardião do Bairro", "Registrou 3 demandas na mesma região", "fa-shield-heart", maiorRegiao, 3),
                conquista("Voz que transforma", "Teve uma demanda resolvida", "fa-circle-check", resolvidas, 1),
                conquista("Conversa aberta", "Fez 3 comentários", "fa-comments", comentarios, 3)
        );

        return new PerfilResponse(UsuarioResponse.de(usuario), criadas, resolvidas, apoios, comentarios, conquistas);
    }

    private static Conquista conquista(String nome, String descricao, String icone, long progresso, long meta) {
        return new Conquista(nome, descricao, icone, progresso >= meta, Math.min(progresso, meta), meta);
    }

    /** Usado pelo seed: busca o usuário pelo e-mail ou cria. */
    public Usuario garantirUsuario(String nome, String email, String senha, Perfil perfil) {
        return usuarioRepository.findByEmail(email)
                .orElseGet(() -> usuarioRepository.save(
                        new Usuario(nome, email, passwordEncoder.encode(senha), perfil)));
    }
}
