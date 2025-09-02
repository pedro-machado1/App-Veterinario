package com.dto.vacinaItem;

import com.dto.animal.AnimalSimpleDto;
import com.dto.vacina.VacinaSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VacinaItemUpdateDto {
    private String nome;

    private String descricao;

    private LocalDate dataAplicacao;

    private Date dataValidade;

    private AnimalSimpleDto animal;
    private VacinaSimpleDto vacina;

}
