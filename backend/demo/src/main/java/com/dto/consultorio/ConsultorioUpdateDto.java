package com.dto.consultorio;

import com.dto.veterinario.VeterinarioSimpleDto;
import com.enums.Estado;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultorioUpdateDto {
    private String nome;

    private String endereco;

    private String telefone;

    private String descricao;

    private LocalDate dataDeFundacao;

    private LocalDate dataDeCadastro;

    private Estado estado;


}
