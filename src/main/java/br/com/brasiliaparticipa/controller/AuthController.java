package br.com.brasiliaparticipa.controller;

import br.com.brasiliaparticipa.dto.CadastroRequest;
import br.com.brasiliaparticipa.dto.LoginRequest;
import br.com.brasiliaparticipa.dto.SessaoResponse;
import br.com.brasiliaparticipa.dto.UsuarioResponse;
import br.com.brasiliaparticipa.model.Usuario;
import br.com.brasiliaparticipa.repository.UsuarioRepository;
import br.com.brasiliaparticipa.security.UsuarioLogado;
import br.com.brasiliaparticipa.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Cadastro, login, logout e sessão")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria a conta de cidadão e já deixa logado")
    public UsuarioResponse cadastrar(@RequestBody @Valid CadastroRequest dados,
                                     HttpServletRequest request, HttpServletResponse response) {
        Usuario usuario = usuarioService.cadastrar(dados);
        autenticar(usuario.getEmail(), dados.senha(), request, response);
        return UsuarioResponse.de(usuario);
    }

    @PostMapping("/login")
    @Operation(summary = "Entra com e-mail e senha (cria a sessão)")
    public UsuarioResponse login(@RequestBody @Valid LoginRequest dados,
                                 HttpServletRequest request, HttpServletResponse response) {
        String email = dados.email().trim().toLowerCase(Locale.ROOT);
        autenticar(email, dados.senha(), request, response);
        return usuarioRepository.findByEmail(email).map(UsuarioResponse::de).orElseThrow();
    }

    @GetMapping("/sessao")
    @Operation(summary = "Diz se existe alguém logado e quem é")
    public SessaoResponse sessao(@AuthenticationPrincipal UsuarioLogado usuario) {
        if (usuario == null) {
            return new SessaoResponse(false, null);
        }
        return usuarioRepository.findById(usuario.getId())
                .map(u -> new SessaoResponse(true, UsuarioResponse.de(u)))
                .orElse(new SessaoResponse(false, null));
    }

    /** Garante que o cookie XSRF-TOKEN existe antes do primeiro POST do navegador. */
    @GetMapping("/csrf")
    @Operation(summary = "Gera o token CSRF (cookie XSRF-TOKEN)")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("cabecalho", token.getHeaderName(), "token", token.getToken());
    }

    /** Confere e-mail/senha e grava o login na sessão HTTP. */
    private void autenticar(String email, String senha, HttpServletRequest request, HttpServletResponse response) {
        Authentication autenticacao = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(email, senha));

        // Troca o id da sessão no login (evita o ataque de "session fixation")
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }

        SecurityContext contexto = SecurityContextHolder.createEmptyContext();
        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);
        securityContextRepository.saveContext(contexto, request, response);
    }
}
