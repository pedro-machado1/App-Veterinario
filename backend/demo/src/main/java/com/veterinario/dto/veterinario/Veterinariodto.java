package com.veterinario.dto.veterinario;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.veterinario.dto.cliente.ClienteSimpleDto;
import com.veterinario.enums.Estado;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class Veterinariodto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private int cpf;

    @NotBlank(message = "Informe o nome")
    private String nome;

    @NotNull(message = "Informe o CRVM")
    private int CRVM;

    @NotNull(message = "Informe o estado em atua")
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @NotBlank(message = "Informe o seu email")
    private String email;

    private List<ClienteSimpleDto> clietes;
}
