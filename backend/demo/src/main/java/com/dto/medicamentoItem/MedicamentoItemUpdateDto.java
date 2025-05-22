package com.dto.medicamentoItem;

import com.dto.animal.AnimalSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.model.Animal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoItemUpdateDto {
    private String nome;
    private int quantidade;
    private String descricao;
    private MedicamentoSimpleDto medicamento;
    private ConsultaSimpleDto consulta;
    private AnimalSimpleDto animal;


}
