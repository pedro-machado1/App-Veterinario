package com.dto.consulta;

import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.medicamentoItemdto.MedicamentoItemSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaUpdateDto {
    @NotBlank(message = "Informe o título da consulta")
    private String titulo;
    @NotBlank(message = "Informe o texto da consulta")
    private String texto;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataCriacao;

    private VeterinarioSimpleDto veterinario;

    @NotNull(message = "Informe o cliente dessa consulta")
    private ClienteSimpleDto cliente;

    private List<AnimalSimpleDto> animal;

    private List<MedicamentoItemSimpleDto> medicamento;
}
