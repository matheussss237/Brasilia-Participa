package br.com.brasiliaparticipa.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Usuário do sistema (coleção "usuarios" no MongoDB). */
@Document("usuarios")
public class Usuario {

    @Id
    private String id;

    private String nome;

    /** E-mail é o login, por isso não pode se repetir. */
    @Indexed(unique = true)
    private String email;

    /** Nunca guardamos a senha em texto puro: aqui fica o hash BCrypt. */
    private String senhaHash;

    private Perfil perfil = Perfil.CIDADAO;

    private Instant criadoEm = Instant.now();

    public Usuario() {
    }

    public Usuario(String nome, String email, String senhaHash, Perfil perfil) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.perfil = perfil;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }

    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}
