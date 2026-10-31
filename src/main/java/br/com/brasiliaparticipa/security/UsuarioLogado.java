package br.com.brasiliaparticipa.security;

import br.com.brasiliaparticipa.model.Perfil;
import br.com.brasiliaparticipa.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * O usuário que está logado, do jeito que o Spring Security entende.
 * Nos controllers, recebemos ele com {@code @AuthenticationPrincipal UsuarioLogado usuario}.
 */
public class UsuarioLogado implements UserDetails, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private final String id;
    private final String nome;
    private final String email;
    private final String senhaHash;
    private final Perfil perfil;

    public UsuarioLogado(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.senhaHash = usuario.getSenhaHash();
        this.perfil = usuario.getPerfil();
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public Perfil getPerfil() { return perfil; }

    public boolean isAdmin() {
        return perfil == Perfil.ADMIN;
    }

    /** "ROLE_ADMIN" ou "ROLE_CIDADAO": é o que o hasRole("ADMIN") do SecurityConfig confere. */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
