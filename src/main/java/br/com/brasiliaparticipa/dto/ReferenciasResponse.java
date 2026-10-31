package br.com.brasiliaparticipa.dto;

import java.util.List;

/** Listas usadas nos selects e no mapa do front-end. */
public record ReferenciasResponse(List<String> categorias, List<Regiao> regioes, List<Status> status) {

    public record Regiao(String nome, double latitude, double longitude) {
    }

    public record Status(String codigo, String texto) {
    }
}
