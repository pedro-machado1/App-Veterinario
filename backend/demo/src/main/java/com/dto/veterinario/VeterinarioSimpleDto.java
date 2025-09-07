package com.dto.veterinario;

import com.enums.Estado;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VeterinarioSimpleDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o CPF de veterinario")
    private String cpf;

    @NotBlank(message = "Informe o nome")
    private String nome;

    @NotBlank(message = "Informe o CRVM")
    private String crvm;

    @NotNull(message = "Informe o estado em atual")
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    @NotNull(message = "Informe a sua data de nascimento")
    private LocalDate dataDeNascimento;

    private String endereco;

    private String imagem;

}
