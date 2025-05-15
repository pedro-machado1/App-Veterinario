package com.dto.animal;

import com.dto.cliente.ClienteSimpleDto;
import com.enums.Genero;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalUpdateDto {

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe o cliente dono do animal")
    private List<ClienteSimpleDto> cliente;

    @NotNull(message = "Informe a sua idade")
    private int idade;

    @Enumerated(EnumType.STRING)
    @NotBlank(message = "Informe o gênero do animal")
    private Genero genero;

    @NotBlank(message = "INforme a especie desse animal")
    private String especie;

    private int altura;

    private int comprimento;

    private int peso;

    private int observacao;

    private int vacina;

    private int doenca;

    private int alergia;

    private int raca;

    private List<AnimalSimpleDto> animal;

}


