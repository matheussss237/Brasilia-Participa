package br.com.brasiliaparticipa.exception;

import br.com.brasiliaparticipa.dto.ErroResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Transforma qualquer exceção em uma resposta JSON padronizada (ErroResponse),
 * para o front-end sempre saber como mostrar o erro.
 */
@RestControllerAdvice
public class TratadorDeErros {

    private static final Logger log = LoggerFactory.getLogger(TratadorDeErros.class);

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(RecursoNaoEncontradoException e) {
        return resposta(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> regraNegocio(RegraNegocioException e) {
        return resposta(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroResponse> credenciais(BadCredentialsException e) {
        return resposta(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos.");
    }

    /** Erros de @Valid: devolve qual campo está errado e por quê. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : e.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        ErroResponse corpo = new ErroResponse(400, "Bad Request",
                "Confira os campos destacados.", campos, Instant.now());
        return ResponseEntity.badRequest().body(corpo);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class, MissingServletRequestPartException.class})
    public ResponseEntity<ErroResponse> requisicaoInvalida(Exception e) {
        return resposta(HttpStatus.BAD_REQUEST, "Requisição inválida: confira os dados enviados.");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErroResponse> arquivoGrande(MaxUploadSizeExceededException e) {
        return resposta(HttpStatus.CONTENT_TOO_LARGE, "A foto é grande demais. O limite é 5 MB.");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> rotaInexistente(NoResourceFoundException e) {
        return resposta(HttpStatus.NOT_FOUND, "Endereço não encontrado.");
    }

    /** Qualquer erro inesperado: registra no log e não expõe detalhes internos. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> erroInesperado(Exception e) {
        // Erros "conhecidos" do Spring (método HTTP errado, tipo de conteúdo errado...) já sabem seu status
        if (e instanceof ErrorResponse erroSpring) {
            HttpStatus status = HttpStatus.valueOf(erroSpring.getStatusCode().value());
            return resposta(status, status.getReasonPhrase());
        }
        if (e instanceof AccessDeniedException) {
            return resposta(HttpStatus.FORBIDDEN, "Você não tem permissão para esta ação.");
        }
        log.error("Erro inesperado", e);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro inesperado. Tente novamente.");
    }

    private ResponseEntity<ErroResponse> resposta(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status)
                .body(new ErroResponse(status.value(), status.getReasonPhrase(), mensagem));
    }
}
