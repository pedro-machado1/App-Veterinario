package com.veterinario.dto.consulta;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class consultasdto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    private String escrito;

    private Date data;

//    private Veterinario veterinario;
}
