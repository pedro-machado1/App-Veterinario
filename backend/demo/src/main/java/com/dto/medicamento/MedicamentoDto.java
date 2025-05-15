package com.dto.medicamento;

import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o nome do Medicamento")
    private String nome;

    @NotBlank(message = "Informe a descrição do Medicamento")
    private String descricao;

    private List<MedicamentoItemSimpleDto> medicamentoItem;

}
