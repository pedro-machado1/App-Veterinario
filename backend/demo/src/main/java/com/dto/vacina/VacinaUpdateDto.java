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
    private String nome;

    private String descricao;

    private int validade;

    private List<VacinaItemSimpleDto> vacinaItem;
}
