package br.com.brasiliaparticipa.dto;

import java.util.List;

/** Página "Meu perfil": dados, números da participação e conquistas (gamificação). */
public record PerfilResponse(
        UsuarioResponse usuario,
        long demandasCriadas,
        long demandasResolvidas,
        long apoiosDados,
        long comentarios,
        List<Conquista> conquistas
) {

    public record Conquista(String nome, String descricao, String icone, boolean conquistada,
                            long progresso, long meta) {
    }
}
