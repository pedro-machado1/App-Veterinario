package com.dto.cliente;

import com.dto.animal.AnimalSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.model.Users;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @NotNull(message = "Informe o id")
    private long id;
    
    @NotBlank(message = "Informe o seu CPF")
    private String cpf;

    @NotBlank(message = "Informe o seu nome")
    private String nome;

    @NotNull(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu endereço")
    private String endereco;
    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    @NotNull(message = "Informe a sua data de nascimento")
    private LocalDate dataDeNascimento;

//    @NotBlank
//    private Image imagem;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private List<AnimalSimpleDto> animal;

    private List<VeterinarioSimpleDto> veterinario;

    private List<ConsultaSimpleDto> consulta;

    private Users users;

}
