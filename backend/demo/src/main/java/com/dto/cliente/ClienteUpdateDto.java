package com.dto.cliente;

import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
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
public class ClienteUpdateDto {

    private String cpf;

    private String nome;

    private String email;

    private String endereco;

    private String telefone;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private List<AnimalSimpleDto> animal;

    private List<VeterinarioSimpleDto> veterinario;

    private LocalDate dataUpdate;

}
