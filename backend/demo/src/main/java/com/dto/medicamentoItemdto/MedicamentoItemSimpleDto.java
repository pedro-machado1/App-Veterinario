package com.dto.medicamentoItemdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoItemSimpleDto {
    private long id;
    private String nome;
    private int quantidade;
}
