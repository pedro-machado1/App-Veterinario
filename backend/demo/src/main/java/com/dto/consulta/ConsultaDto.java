package com.dto.consulta;

import com.dto.medicamento.MedicamentoDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataCriacao;

    @NotBlank(message = "Informe o texto da consulta")
    private String texto;

    private VeterinarioSimpleDto veterinario;

    @NotBlank(message = "Inorme o cliente dessa consulta")
    private ClienteSimpleDto cliente;

    private List<MedicamentoDto> medicamento;
}
