package com.dto.cliente;

import com.dto.animal.AnimalSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDto {
    @NotNull(message = "Informe o id")
    private long id;
    
    @NotNull(message = "Informe o seu CPF")
    private int cpf;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotNull(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu endereço")
    private String endereco;
    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private List<AnimalSimpleDto> animal;

    private List<VeterinarioSimpleDto> veterinario;

}
