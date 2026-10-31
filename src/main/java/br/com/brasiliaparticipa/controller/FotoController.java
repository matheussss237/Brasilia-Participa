package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.service.FotoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@Tag(name = "Fotos")
public class FotoController {

    private final FotoService fotoService;

    public FotoController(FotoService fotoService) {
        this.fotoService = fotoService;
    }

    @GetMapping("/api/fotos/{id}")
    @Operation(summary = "Devolve a foto de uma demanda (guardada no GridFS)")
    public ResponseEntity<Resource> foto(@PathVariable String id) {
        GridFsResource foto = fotoService.buscar(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(foto.getContentType()))
                // A foto nunca muda depois de enviada: o navegador pode guardar em cache
                .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic().immutable())
                .body(foto);
    }
}
