package com.veterinario.dto.veterinario;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class veterinariodto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private int cpf;
    @NotNull(message = "Esse valor não pode ser vazio")
    private int CRVM;

//    private Estado estado;

    private String email;
}
