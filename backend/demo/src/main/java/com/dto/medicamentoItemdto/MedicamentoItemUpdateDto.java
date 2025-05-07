package com.dto.medicamentoItemdto;

import com.dto.consulta.ConsultaDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MedicamentoItemUpdateDto {
    @NotBlank(message = "Informe o nome do Medicamento")
    private String nome;
    @NotNull(message = "Informe a quantidade do Medicamento")
    private int quantidade;
    @NotBlank(message = "Informe a descrição do Medicamento")
    private String descricao;
    private MedicamentoSimpleDto medicamento;
    private ConsultaDto consulta;

}
