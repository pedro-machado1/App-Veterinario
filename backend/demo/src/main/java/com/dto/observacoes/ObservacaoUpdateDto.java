package com.dto.observacoes;

import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObservacaoUpdateDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataCriacao;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataAlteracao;

    @NotBlank(message = "Informe o texto da observação")
    private String texto;

    @NotBlank(message = "Informe o veterinario que fez a observação")
    private VeterinarioSimpleDto veterinario;

    @NotBlank(message = "Informe o animal da observação")
    private AnimalSimpleDto animal;

}
