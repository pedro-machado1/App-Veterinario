package com.veterinario.dto.cliente;

import com.veterinario.dto.animal.AnimalSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Clientedto {
    @NotNull(message = "Informe o seu CPF")
    private int cpf;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu endereço")
    private String endereco;

    private String telefone;

    private List<AnimalSimpleDto> animais;

}
