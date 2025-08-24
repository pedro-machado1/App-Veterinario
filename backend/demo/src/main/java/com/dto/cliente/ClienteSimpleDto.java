package com.dto.cliente;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteSimpleDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @NotNull(message = "Informe o id")
    private long id;

    @NotBlank(message = "Informe o seu CPF")
    private String cpf;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe o seu endereço")
    private String endereco;
    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    //    @NotNull(message = "Informe a sua data de nascimento")
    private LocalDate dataDeNascimento;

//    @NotBlank
//    private Image imagem;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;
    }
