package com.veterinario.dto.animal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.veterinario.enums.Genero;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// atualizar BD
@Data
@AllArgsConstructor
@NoArgsConstructor
public class animaldto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;
    @NotBlank(message = "Esse valor não pode ser vazio")
    private String nome;
    @NotNull(message = "Esse valor não pode ser vazio")
    private int idade;

    private int peso;
    @Enumerated(EnumType.STRING)
    private Genero genero;
    @NotBlank(message = "Esse valor não pode ser vazio")
    private String especie;

    private int altura;

    private int largura;

}
