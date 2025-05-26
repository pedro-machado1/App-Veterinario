package com.dto.animal;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.observacao.ObservacaoSimpleDto;
import com.dto.vacinaItem.VacinaItemSimpleDto;
import com.enums.Genero;
import com.model.Consulta;
import com.model.MedicamentoItem;
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

    private String nome;

    private int idade;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private String especie;

    private int altura;

    private int comprimento;

    private int peso;

    private int vacina;

    private int doenca;

    private int alergia;

    private int raca;

}


