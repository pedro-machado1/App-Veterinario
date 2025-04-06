package com.veterinario.dto.cliente.cliente;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class clientedto {
    @NotNull(message = "Esse valor não pode ser vazio")
    private int cpf;

    @NotBlank(message = "Esse valor não pode ser vazio")
    private String nome;

    @NotBlank(message = "Esse valor não pode ser vazio")
    private String email;

    private String endereco;



}
