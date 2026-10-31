package br.com.brasiliaparticipa.model;

/**
 * Etapas pelas quais uma demanda passa.
 * O "texto" é o que aparece para o cidadão na tela.
 */
public enum StatusDemanda {

    RECEBIDA("Recebida"),
    EM_ANALISE("Em análise"),
    PENDENTE("Pendente"),
    RESOLVIDA("Resolvida");

    private final String texto;

    StatusDemanda(String texto) {
        this.texto = texto;
    }

    public String getTexto() {
        return texto;
    }
}
