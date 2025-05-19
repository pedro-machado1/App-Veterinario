package com.dto.medicamento;

import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoUpdateDto {
    private String nome;

    private String descricao;

    private List<MedicamentoItemSimpleDto> medicamentoItem;


}
