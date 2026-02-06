package com.dto.cidade;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CidadeDto {

    @NotNull(message = "id")
    private Long id;

    @NotNull(message = "IBGE")
    private Long idIbge;

    @NotBlank(message = "cidade")
    private String nome;

    @NotBlank(message = "UF")
    private String uf;
}
