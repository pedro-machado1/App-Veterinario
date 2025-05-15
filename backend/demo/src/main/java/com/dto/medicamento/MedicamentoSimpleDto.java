package com.dto.medicamento;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoSimpleDto {
    private long id;
    private String nome;
    private String descricao;

}
