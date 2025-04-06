package com.veterinario.dto.animal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalSimpleDto {
    private int id;
    private String nome;
    private String especie;
}
