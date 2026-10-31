package br.com.brasiliaparticipa.config;

import br.com.brasiliaparticipa.dto.ErroResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;

/**
 * Regras de segurança:
 * <ul>
 *   <li>Qualquer pessoa vê o site, as demandas, o mapa e o dashboard.</li>
 *   <li>Para registrar, apoiar ou comentar é preciso estar logado.</li>
 *   <li>Só o ADMIN muda o status ou exclui uma demanda.</li>
 * </ul>
 * O login usa sessão (cookie JSESSIONID) e proteção CSRF: o navegador recebe o cookie
 * XSRF-TOKEN e o js/api.js devolve ele no cabeçalho X-XSRF-TOKEN em todo POST/PATCH/DELETE.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filtroDeSeguranca(HttpSecurity http, JsonMapper jsonMapper) throws Exception {
        http
                .csrf(csrf -> csrf.spa())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(regras -> regras
                        // API pública (somente leitura)
                        .requestMatchers(HttpMethod.GET,
                                "/api/demandas", "/api/demandas/**",
                                "/api/estatisticas", "/api/referencias", "/api/fotos/**",
                                "/api/auth/sessao", "/api/auth/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/cadastro").permitAll()
                        // Só administrador
                        .requestMatchers(HttpMethod.PATCH, "/api/demandas/*/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/demandas/*").hasRole("ADMIN")
                        // Resto da API: precisa estar logado
                        .requestMatchers("/api/**").authenticated()
                        // Páginas HTML, CSS, JS, imagens e Swagger
                        .anyRequest().permitAll()
                )
                .exceptionHandling(erros -> erros
                        .authenticationEntryPoint((req, res, e) -> responderErro(res, jsonMapper,
                                HttpStatus.UNAUTHORIZED, "Faça login para continuar."))
                        .accessDeniedHandler((req, res, e) -> responderErro(res, jsonMapper,
                                HttpStatus.FORBIDDEN, "Você não tem permissão para esta ação."))
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(HttpServletResponse.SC_NO_CONTENT))
                );

        return http.build();
    }

    /** BCrypt: transforma a senha num hash que não dá para "desfazer". */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
                                                       PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }

    /** Onde o login fica guardado entre uma requisição e outra: na sessão HTTP. */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    private static void responderErro(HttpServletResponse res, JsonMapper jsonMapper,
                                      HttpStatus status, String mensagem) throws IOException {
        res.setStatus(status.value());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding("UTF-8");
        jsonMapper.writeValue(res.getOutputStream(),
                new ErroResponse(status.value(), status.getReasonPhrase(), mensagem));
    }
}
