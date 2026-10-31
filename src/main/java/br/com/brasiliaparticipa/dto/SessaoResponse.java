package br.com.brasiliaparticipa.dto;

/** Responde "quem está logado?" — usuario é null quando ninguém está. */
public record SessaoResponse(boolean logado, UsuarioResponse usuario) {
}
