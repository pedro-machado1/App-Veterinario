package com.dto.observacao;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
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
public class ObservacaoDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate dataCriacao;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate dataAlteracao;

    @NotBlank(message = "Informe o texto da observação")
    private String texto;

//    @NotNull(message = "Informe o veterinario que fez a observação")
    private VeterinarioSimpleDto veterinario;

//    @NotNull(message = "Informe o animal da observação")
    private AnimalSimpleDto animal;

}
