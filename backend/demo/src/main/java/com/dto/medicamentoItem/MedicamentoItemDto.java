package com.dto.medicamentoItem;

import com.dto.consulta.ConsultaSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.model.Animal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoItemDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;
    @NotBlank(message = "Informe o nome do Medicamento")
    private String nome;
    @NotNull(message = "Informe a quantidade do Medicamento")
    private int quantidade;
    @NotBlank(message = "Informe a descrição do Medicamento")
    private String descricao;
    private MedicamentoSimpleDto medicamento;
    private ConsultaSimpleDto consulta;
    private Animal animal;
}
