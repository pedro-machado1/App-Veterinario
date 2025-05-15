package com.dto.vacina;

import com.dto.vacinaItem.VacinaItemSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VacinaUpdateDto {
    @NotBlank(message = "Informe o nome da vacina")
    private String nome;

    @NotBlank(message = "Informe a descricao da vacina")
    private String descricao;

    @NotNull(message = "Informe a validade da vacina")
    private int validade;

    private List<VacinaItemSimpleDto> vacinaItem;
}
