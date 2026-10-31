package br.com.brasiliaparticipa.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Uma demanda (problema urbano) registrada por um cidadão.
 * <p>
 * Aqui aparece a vantagem do MongoDB: o histórico de status, os comentários e a
 * lista de quem apoiou ficam DENTRO do mesmo documento. Uma única leitura traz tudo,
 * sem precisar de JOIN entre várias tabelas.
 */
@Document("demandas")
public class Demanda {

    @Id
    private String id;

    private String titulo;
    private String descricao;

    @Indexed
    private String categoria;

    @Indexed
    private String regiao;

    /** Endereço escrito pelo cidadão (rua, quadra, ponto de referência). */
    private String endereco;

    /** Ponto exato marcado no mapa. */
    private double latitude;
    private double longitude;

    @Indexed
    private StatusDemanda status = StatusDemanda.RECEBIDA;

    /** Caminho da foto: /api/fotos/{id} (enviada pelo cidadão) ou /imagens/... (dados de exemplo). */
    private String fotoUrl;

    @Indexed
    private String autorId;
    private String autorNome;

    /** Ids dos usuários que apoiaram. Um Set garante que cada pessoa apoia só uma vez. */
    @Indexed
    private Set<String> apoiadores = new HashSet<>();

    /** Contador de apoios (guardado separado para ordenar rápido por "mais apoiadas"). */
    @Indexed
    private int totalApoios;

    private List<RegistroHistorico> historico = new ArrayList<>();
    private List<Comentario> comentarios = new ArrayList<>();

    @Indexed
    private Instant criadaEm = Instant.now();
    private Instant atualizadaEm = Instant.now();
    private Instant resolvidaEm;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getRegiao() { return regiao; }
    public void setRegiao(String regiao) { this.regiao = regiao; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public StatusDemanda getStatus() { return status; }
    public void setStatus(StatusDemanda status) { this.status = status; }

    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    public String getAutorId() { return autorId; }
    public void setAutorId(String autorId) { this.autorId = autorId; }

    public String getAutorNome() { return autorNome; }
    public void setAutorNome(String autorNome) { this.autorNome = autorNome; }

    public Set<String> getApoiadores() { return apoiadores; }
    public void setApoiadores(Set<String> apoiadores) { this.apoiadores = apoiadores; }

    public int getTotalApoios() { return totalApoios; }
    public void setTotalApoios(int totalApoios) { this.totalApoios = totalApoios; }

    public List<RegistroHistorico> getHistorico() { return historico; }
    public void setHistorico(List<RegistroHistorico> historico) { this.historico = historico; }

    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> comentarios) { this.comentarios = comentarios; }

    public Instant getCriadaEm() { return criadaEm; }
    public void setCriadaEm(Instant criadaEm) { this.criadaEm = criadaEm; }

    public Instant getAtualizadaEm() { return atualizadaEm; }
    public void setAtualizadaEm(Instant atualizadaEm) { this.atualizadaEm = atualizadaEm; }

    public Instant getResolvidaEm() { return resolvidaEm; }
    public void setResolvidaEm(Instant resolvidaEm) { this.resolvidaEm = resolvidaEm; }
}
