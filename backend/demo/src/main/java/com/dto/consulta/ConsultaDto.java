package com.dto.consulta;

import com.dto.animal.AnimalSimpleDto;
import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaDto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private long id;
    @NotBlank(message = "Informe o título da consulta")
    private String titulo;
    @NotBlank(message = "Informe o texto da consulta")
    private String texto;

    private LocalDate dataCriacao;

    private LocalDate dataAlteracao;

//    @NotNull(message = "Informe o veterinário que registrou essa consulta")
    private VeterinarioSimpleDto veterinario;

    @NotNull(message = "Informe o cliente dessa consulta")
    private ClienteSimpleDto cliente;

    private List<AnimalSimpleDto> animal;

    private List<MedicamentoItemSimpleDto> medicamentoItem;
}
