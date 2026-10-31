package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.dto.PerfilResponse;
import br.com.brasiliaparticipa.security.UsuarioLogado;
import br.com.brasiliaparticipa.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/perfil")
@Tag(name = "Perfil")
public class PerfilController {

    private final UsuarioService usuarioService;

    public PerfilController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Dados do usuário logado, números de participação e conquistas")
    public PerfilResponse meuPerfil(@AuthenticationPrincipal UsuarioLogado usuario) {
        return usuarioService.perfil(usuario.getId());
    }
}
