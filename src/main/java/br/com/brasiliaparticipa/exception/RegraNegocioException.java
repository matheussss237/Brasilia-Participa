package br.com.brasiliaparticipa.exception;

import org.springframework.http.HttpStatus;

/** Erro de regra do sistema (ex.: e-mail já cadastrado). Vira o status HTTP informado. */
public class RegraNegocioException extends RuntimeException {

    private final HttpStatus status;

    public RegraNegocioException(String mensagem) {
        this(HttpStatus.BAD_REQUEST, mensagem);
    }

    public RegraNegocioException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
