package br.com.brasiliaparticipa.dto;

import br.com.brasiliaparticipa.model.Usuario;

import java.time.Instant;

/** Dados públicos do usuário (sem a senha!). */
public record UsuarioResponse(String id, String nome, String email, String perfil, Instant criadoEm) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getPerfil().name(), u.getCriadoEm());
    }
}
