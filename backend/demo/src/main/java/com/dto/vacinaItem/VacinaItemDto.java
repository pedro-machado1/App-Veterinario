package com.dto.vacinaItem;

import com.dto.animal.AnimalSimpleDto;
import com.dto.vacina.VacinaSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VacinaItemDto {
    @Id
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o nome da vacina")
    private String nome;

    private String descricao;

    @NotNull(message = "Informe a data que a vacina foi aplicada vacina")
    private Date dataAplicacao;

    @NotNull(message = "Informe at[e que data a vacina é válida")
    private Date dataValidade;

//    @NotNull(message = "Informe o animal que essa vacina foi aplicada")
    private AnimalSimpleDto animal;

//    @NotNull(message = "Informe a vacina que foi aplicada")
    private VacinaSimpleDto vacina;
}
