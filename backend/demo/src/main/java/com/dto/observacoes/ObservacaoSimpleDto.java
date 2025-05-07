package com.dto.observacoes;

import com.model.Veterinario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObservacaoSimpleDto {
    private long id;
    private String texto;
    private Veterinario veterinario;

}
