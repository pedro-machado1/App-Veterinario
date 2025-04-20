package com.dto.animal;

import com.enums.Genero;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.dto.cliente.ClienteSimpleDto;
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
public class Animaldto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe o cliente dono do animal")
    private ClienteSimpleDto cliente;

    @NotNull(message = "Informe a sua idade")
    private int idade;

    @Enumerated(EnumType.STRING)
    @NotBlank(message = "Informe o gênero do animal")
    private Genero genero;

    @NotBlank(message = "INforme a especie desse animal")
    private String especie;

    private int altura;

    private int peso;

    private int largura;

}
