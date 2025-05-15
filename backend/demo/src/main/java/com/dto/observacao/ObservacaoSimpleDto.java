package com.dto.observacao;

import com.dto.veterinario.VeterinarioSimpleDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObservacaoSimpleDto {
    private long id;
    private String texto;
    private VeterinarioSimpleDto veterinario;

}
