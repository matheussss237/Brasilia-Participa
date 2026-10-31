package br.com.brasiliaparticipa.dto;

import java.util.List;

/** Lista paginada: o front pede a página 0, 1, 2... ("Carregar mais"). */
public record PaginaResponse<T>(List<T> itens, int pagina, int tamanho, long total, boolean temMais) {
}
