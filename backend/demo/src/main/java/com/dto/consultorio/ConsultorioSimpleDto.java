package com.dto.consultorio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultorioSimpleDto {
    private long id;
    private String nome;
    private String endereco;
    private String descricao;
}
