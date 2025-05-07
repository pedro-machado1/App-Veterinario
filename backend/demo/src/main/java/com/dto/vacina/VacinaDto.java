package com.dto.vacina;

import com.dto.vacinaItemdto.VacinaItemSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacinaDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank(message = "Informe o nome da vacina")
    private String nome;

    @NotBlank(message = "Informe a descricao da vacina")
    private String descricao;

    @NotBlank(message = "Informe a validade da vacina")
    private int validade;

    private List<VacinaItemSimpleDto> vacinaItem;

}
