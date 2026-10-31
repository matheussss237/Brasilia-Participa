package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.dto.ReferenciasResponse;
import br.com.brasiliaparticipa.model.Referencias;
import br.com.brasiliaparticipa.model.StatusDemanda;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@Tag(name = "Referências")
public class ReferenciaController {

    @GetMapping("/api/referencias")
    @Operation(summary = "Categorias, regiões administrativas (com coordenadas) e status")
    public ReferenciasResponse referencias() {
        return new ReferenciasResponse(
                Referencias.CATEGORIAS,
                Referencias.REGIOES.entrySet().stream()
                        .map(e -> new ReferenciasResponse.Regiao(e.getKey(), e.getValue().latitude(), e.getValue().longitude()))
                        .toList(),
                Arrays.stream(StatusDemanda.values())
                        .map(s -> new ReferenciasResponse.Status(s.name(), s.getTexto()))
                        .toList()
        );
    }
}
