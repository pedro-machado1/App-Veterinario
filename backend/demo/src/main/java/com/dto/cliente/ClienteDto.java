package com.dto.cliente;

import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDto {
    @NotNull(message = "Informe o seu CPF")
    private int cpf;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu endereço")
    private String endereco;

    private String telefone;

    private List<AnimalSimpleDto> animal;

    private List<VeterinarioSimpleDto> veterinario;

}
