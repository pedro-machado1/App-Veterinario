package com.dto.veterinario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VeterinarioSimpleDto {
    private long id;
    private int cpf;
    private String nome;
}
