package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.dto.EstatisticasResponse;
import br.com.brasiliaparticipa.service.EstatisticaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Estatísticas")
public class EstatisticaController {

    private final EstatisticaService estatisticaService;

    public EstatisticaController(EstatisticaService estatisticaService) {
        this.estatisticaService = estatisticaService;
    }

    @GetMapping("/api/estatisticas")
    @Operation(summary = "Indicadores da home e do dashboard")
    public EstatisticasResponse estatisticas() {
        return estatisticaService.calcular();
    }
}
