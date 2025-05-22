package com.dto.consulta;

import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
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
    private String titulo;

    private String texto;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataCriacao;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataAlteracao;

    private VeterinarioSimpleDto veterinario;

    private ClienteSimpleDto cliente;

    private List<AnimalSimpleDto> animal;

    private List<MedicamentoItemSimpleDto> medicamento;
}
