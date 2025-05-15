package com.dto.vacinaItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VacinaItemSimpleDto {
    private long id;
    private String nome;
    private Date dataAplicacao;
    private Date dataValidade;
}
