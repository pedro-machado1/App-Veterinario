package com.dto.cidade;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CidadeSimpleDto {

    private Long id;

    private Long idIbge;

    private String nome;

    private String uf;
}
