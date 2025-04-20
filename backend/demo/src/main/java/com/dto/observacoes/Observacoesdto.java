package com.dto.observacoes;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Observacoesdto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime data;

    @NotBlank(message = "Informe o texto da observação")
    private String texto;

    private VeterinarioSimpleDto veterinario;

    @NotBlank(message = "Informe o animal da observação")
    private AnimalSimpleDto animal;

}
