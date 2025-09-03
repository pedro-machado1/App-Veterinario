package com.dto.animal;

import com.enums.Genero;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalSimpleDto {
    private int id;

    private String nome;

    private String especie;

    private int idade;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private int altura;

    private int comprimento;

    private int peso;

    private String doenca;

    private String alergia;

    private String raca;

    private String imagem;

}
