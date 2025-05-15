package com.dto.consulta;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaSimpleDto {
    private long id;
    private String titulo;
    private String texto;
}
