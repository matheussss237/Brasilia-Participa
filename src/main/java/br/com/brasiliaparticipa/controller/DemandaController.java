package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.dto.AlterarStatusRequest;
import br.com.brasiliaparticipa.dto.ApoioResponse;
import br.com.brasiliaparticipa.dto.ComentarioRequest;
import br.com.brasiliaparticipa.dto.DemandaDetalheResponse;
import br.com.brasiliaparticipa.dto.DemandaDetalheResponse.ComentarioResponse;
import br.com.brasiliaparticipa.dto.DemandaProximaResponse;
import br.com.brasiliaparticipa.dto.DemandaRequest;
import br.com.brasiliaparticipa.dto.DemandaResponse;
import br.com.brasiliaparticipa.dto.PaginaResponse;
import br.com.brasiliaparticipa.exception.RegraNegocioException;
import br.com.brasiliaparticipa.model.Demanda;
import br.com.brasiliaparticipa.model.StatusDemanda;
import br.com.brasiliaparticipa.security.UsuarioLogado;
import br.com.brasiliaparticipa.service.DemandaService;
import br.com.brasiliaparticipa.service.FiltroDemandas;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/demandas")
@Tag(name = "Demandas", description = "Registro, consulta, apoio, comentários e status das demandas")
public class DemandaController {

    private final DemandaService demandaService;

    public DemandaController(DemandaService demandaService) {
        this.demandaService = demandaService;
    }

    @GetMapping
    @Operation(summary = "Lista demandas com filtros e paginação")
    public PaginaResponse<DemandaResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) StatusDemanda status,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String regiao,
            @RequestParam(defaultValue = "false") boolean minhas,
            @RequestParam(defaultValue = "recentes") String ordenar,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "12") int tamanho,
            @AuthenticationPrincipal UsuarioLogado usuario) {

        String usuarioId = usuario != null ? usuario.getId() : null;
        if (minhas && usuarioId == null) {
            throw new RegraNegocioException(HttpStatus.UNAUTHORIZED, "Faça login para ver suas demandas.");
        }
        FiltroDemandas filtro = new FiltroDemandas(q, status, categoria, regiao, minhas ? usuarioId : null, ordenar);
        return demandaService.listar(filtro, pagina, tamanho, usuarioId);
    }

    @GetMapping("/proximas")
    @Operation(summary = "Demandas não resolvidas da mesma categoria a até 300 m do ponto (evita duplicadas)")
    public List<DemandaProximaResponse> proximas(@RequestParam double lat, @RequestParam double lng,
                                                 @RequestParam(required = false) String categoria,
                                                 @AuthenticationPrincipal UsuarioLogado usuario) {
        return demandaService.proximas(lat, lng, categoria, usuario != null ? usuario.getId() : null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalhe da demanda com linha do tempo e comentários")
    public DemandaDetalheResponse detalhar(@PathVariable String id, @AuthenticationPrincipal UsuarioLogado usuario) {
        return DemandaDetalheResponse.de(demandaService.buscar(id), usuario != null ? usuario.getId() : null);
    }

    /**
     * Recebe multipart/form-data com duas partes:
     * "dados" (JSON da demanda) e "foto" (arquivo de imagem, opcional).
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Registra uma nova demanda (requer login)")
    public ResponseEntity<DemandaResponse> criar(@RequestPart("dados") @Valid DemandaRequest dados,
                                                 @RequestPart(value = "foto", required = false) MultipartFile foto,
                                                 @AuthenticationPrincipal UsuarioLogado usuario) {
        Demanda criada = demandaService.criar(dados, foto, usuario);
        return ResponseEntity.created(URI.create("/api/demandas/" + criada.getId()))
                .body(DemandaResponse.de(criada, usuario.getId()));
    }

    @PostMapping("/{id}/apoio")
    @Operation(summary = "Apoia a demanda, ou remove o apoio se já tinha apoiado (requer login)")
    public ApoioResponse apoiar(@PathVariable String id, @AuthenticationPrincipal UsuarioLogado usuario) {
        return demandaService.alternarApoio(id, usuario.getId());
    }

    @PostMapping("/{id}/comentarios")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Comenta na demanda (comentário de ADMIN aparece como resposta oficial)")
    public ComentarioResponse comentar(@PathVariable String id, @RequestBody @Valid ComentarioRequest dados,
                                       @AuthenticationPrincipal UsuarioLogado usuario) {
        return ComentarioResponse.de(demandaService.comentar(id, dados.texto(), usuario));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Muda o status e registra na linha do tempo (somente ADMIN)")
    public DemandaDetalheResponse alterarStatus(@PathVariable String id, @RequestBody @Valid AlterarStatusRequest dados,
                                                @AuthenticationPrincipal UsuarioLogado usuario) {
        return DemandaDetalheResponse.de(demandaService.alterarStatus(id, dados, usuario), usuario.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui a demanda, ex.: spam ou duplicada (somente ADMIN)")
    public void excluir(@PathVariable String id) {
        demandaService.excluir(id);
    }
}
