package com.veterinario.dto.observacoes;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class observacoesdto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    private long AnimalID;

    private Date data;

    private String comentario;
    @NotNull(message = "Esse valor não pode ser vazio")
    private int VeterinarioCpf;

}
