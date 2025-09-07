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
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Informe o id")
    private long id;

    private String cpf;

    private String nome;

    private String endereco;

    private String telefone;

    private LocalDate dataDeNascimento;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private String imagem;

}
