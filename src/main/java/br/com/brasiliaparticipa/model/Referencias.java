package br.com.brasiliaparticipa.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Listas fixas do sistema: categorias e Regiões Administrativas do DF (com o
 * ponto central aproximado de cada uma). O front-end busca isso em /api/referencias,
 * então só existe UM lugar para editar essas listas.
 */
public final class Referencias {

    private Referencias() {
    }

    public record Coordenada(double latitude, double longitude) {
    }

    public static final List<String> CATEGORIAS = List.of(
            "Infraestrutura", "Iluminação", "Limpeza", "Segurança", "Transporte",
            "Meio ambiente", "Educação", "Saúde", "Acessibilidade"
    );

    public static final Map<String, Coordenada> REGIOES = new LinkedHashMap<>();

    static {
        REGIOES.put("Plano Piloto", new Coordenada(-15.7942, -47.8822));
        REGIOES.put("Gama", new Coordenada(-16.0189, -48.0642));
        REGIOES.put("Taguatinga", new Coordenada(-15.8330, -48.0559));
        REGIOES.put("Brazlândia", new Coordenada(-15.6699, -48.2032));
        REGIOES.put("Sobradinho", new Coordenada(-15.6519, -47.7869));
        REGIOES.put("Sobradinho II", new Coordenada(-15.6425, -47.7622));
        REGIOES.put("Planaltina", new Coordenada(-15.6206, -47.6547));
        REGIOES.put("Paranoá", new Coordenada(-15.7742, -47.7658));
        REGIOES.put("Núcleo Bandeirante", new Coordenada(-15.8686, -47.9679));
        REGIOES.put("Ceilândia", new Coordenada(-15.8151, -48.1099));
        REGIOES.put("Guará", new Coordenada(-15.8258, -47.9776));
        REGIOES.put("Cruzeiro", new Coordenada(-15.7891, -47.9436));
        REGIOES.put("Samambaia", new Coordenada(-15.8752, -48.0904));
        REGIOES.put("Santa Maria", new Coordenada(-16.0128, -48.0064));
        REGIOES.put("São Sebastião", new Coordenada(-15.9046, -47.7758));
        REGIOES.put("Recanto das Emas", new Coordenada(-15.9060, -48.0644));
        REGIOES.put("Lago Sul", new Coordenada(-15.8283, -47.8483));
        REGIOES.put("Lago Norte", new Coordenada(-15.7391, -47.8531));
        REGIOES.put("Riacho Fundo", new Coordenada(-15.8825, -48.0169));
        REGIOES.put("Riacho Fundo II", new Coordenada(-15.9083, -48.0333));
        REGIOES.put("Candangolândia", new Coordenada(-15.8258, -47.9308));
        REGIOES.put("Águas Claras", new Coordenada(-15.8375, -48.0281));
        REGIOES.put("Sudoeste/Octogonal", new Coordenada(-15.8034, -47.9268));
        REGIOES.put("Varjão", new Coordenada(-15.7113, -47.8394));
        REGIOES.put("Park Way", new Coordenada(-15.8781, -47.9614));
        REGIOES.put("SCIA/Estrutural", new Coordenada(-15.7803, -48.0089));
        REGIOES.put("Jardim Botânico", new Coordenada(-15.8672, -47.7783));
        REGIOES.put("Itapoã", new Coordenada(-15.7364, -47.7508));
        REGIOES.put("SIA", new Coordenada(-15.7967, -47.9564));
        REGIOES.put("Vicente Pires", new Coordenada(-15.8214, -48.0011));
        REGIOES.put("Fercal", new Coordenada(-15.5822, -47.7908));
        REGIOES.put("Sol Nascente/Pôr do Sol", new Coordenada(-15.8130, -48.1381));
        REGIOES.put("Arniqueira", new Coordenada(-15.8481, -48.0244));
    }

    /** Limites aproximados do Distrito Federal, para recusar pontos marcados fora dele. */
    public static final double LAT_MIN = -16.06, LAT_MAX = -15.49;
    public static final double LNG_MIN = -48.29, LNG_MAX = -47.30;

    public static boolean dentroDoDF(double latitude, double longitude) {
        return latitude >= LAT_MIN && latitude <= LAT_MAX
                && longitude >= LNG_MIN && longitude <= LNG_MAX;
    }
}
