package com.dto.vacina;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VacinaSimpleDto {
    private String nome;
    private String descricao;
    private int validade;

}
