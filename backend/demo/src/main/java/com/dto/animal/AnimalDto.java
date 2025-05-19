package com.dto.animal;

import com.dto.consulta.ConsultaSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
import com.dto.observacao.ObservacaoSimpleDto;
import com.dto.vacinaItem.VacinaItemSimpleDto;
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

import java.util.List;

// atualizar BD
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotBlank(message = "Informe a especie desse animal")
    private String especie;

    @NotNull(message = "Informe a sua idade")
    private int idade;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private int altura;

    private int comprimento;

    private int peso;

    private String texto;

    private String doenca;

    private String alergia;

    private String raca;

    private List<ClienteSimpleDto> cliente;

    private List<ObservacaoSimpleDto> observacao;

    private List<ConsultaSimpleDto> consulta;

    private List<MedicamentoItemSimpleDto> medicamentoItem;

    private List<VacinaItemSimpleDto> vacina;
}
