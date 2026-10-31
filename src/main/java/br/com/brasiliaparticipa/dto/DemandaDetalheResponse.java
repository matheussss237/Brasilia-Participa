package br.com.brasiliaparticipa.dto;

import br.com.brasiliaparticipa.model.Comentario;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.RegistroHistorico;

import java.time.Instant;
import java.util.List;

/** Página de detalhe: a demanda + linha do tempo + comentários. */
public record DemandaDetalheResponse(
        DemandaResponse demanda,
        List<HistoricoResponse> historico,
        List<ComentarioResponse> comentarios
) {

    public record HistoricoResponse(String status, String statusTexto, String observacao,
                                    String responsavel, Instant data) {
        static HistoricoResponse de(RegistroHistorico h) {
            return new HistoricoResponse(h.status().name(), h.status().getTexto(),
                    h.observacao(), h.responsavel(), h.data());
        }
    }

    public record ComentarioResponse(String id, String autorNome, String texto, boolean oficial, Instant data) {
        public static ComentarioResponse de(Comentario c) {
            return new ComentarioResponse(c.id(), c.autorNome(), c.texto(), c.oficial(), c.data());
        }
    }

    public static DemandaDetalheResponse de(Demanda d, String usuarioId) {
        return new DemandaDetalheResponse(
                DemandaResponse.de(d, usuarioId),
                d.getHistorico().stream().map(HistoricoResponse::de).toList(),
                d.getComentarios().stream().map(ComentarioResponse::de).toList()
        );
    }
}
