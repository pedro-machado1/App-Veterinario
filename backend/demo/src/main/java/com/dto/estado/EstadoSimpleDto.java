package com.dto.estado;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadoSimpleDto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotNull(message = "Informe o id")
    private Integer codigoUf;

    private String uf;

    private String nome;

    private Double latitude;

    private Double longitude;

    private String regiao;
}
