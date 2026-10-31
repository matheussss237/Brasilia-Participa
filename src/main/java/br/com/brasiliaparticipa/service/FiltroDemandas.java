package br.com.brasiliaparticipa.service;

import br.com.brasiliaparticipa.model.StatusDemanda;

/**
 * Filtros da listagem de demandas. Todos são opcionais (null = não filtrar).
 *
 * @param texto     busca no título, descrição, região e endereço
 * @param autorId   preenchido quando o usuário pede "minhas demandas"
 * @param ordenar   "recentes" (padrão), "apoios" ou "antigas"
 */
public record FiltroDemandas(String texto, StatusDemanda status, String categoria, String regiao,
                             String autorId, String ordenar) {
}
