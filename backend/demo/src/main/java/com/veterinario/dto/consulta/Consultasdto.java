package com.veterinario.dto.consulta;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.veterinario.dto.cliente.ClienteSimpleDto;
import com.veterinario.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Consultasdto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime data;

    @NotBlank(message = "Informe o texto da consulta")
    private String texto;

    private VeterinarioSimpleDto veterinario;

    @NotBlank(message = "Inorme o cliente dessa consulta")
    private ClienteSimpleDto cliente;
}
