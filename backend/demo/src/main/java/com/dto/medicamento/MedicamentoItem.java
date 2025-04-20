package com.dto.medicamento;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MedicamentoItem {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;
    @NotBlank(message = "Informe o nome do Medicamento")
    private String nome;
    @NotNull(message = "Informe a quantidade do Medicamento")
    private int quantidade;
    @NotBlank(message = "Informe a descrição do Medicamento")
    private String descricao;
}
