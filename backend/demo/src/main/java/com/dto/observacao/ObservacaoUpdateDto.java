package com.dto.observacao;

import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObservacaoUpdateDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate dataCriacao;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate dataAlteracao;

    private String texto;

    private VeterinarioSimpleDto veterinario;

    private AnimalSimpleDto animal;

}
