package br.com.brasiliaparticipa.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotBlank(message = "Informe seu nome")
        @Size(min = 3, max = 80, message = "O nome deve ter entre 3 e 80 caracteres")
        String nome,

        @NotBlank(message = "Informe seu e-mail")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "Crie uma senha")
        @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres")
        String senha
) {
}
