package com.dto.cliente;

import com.dto.animal.AnimalSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.users.UpdateUsersdto;
import com.dto.users.UsersSimpleDto;
import com.dto.users.UsersWithoutPassword;
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

    private LocalDate dataDeNascimento;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private String imagem;

    private List<AnimalSimpleDto> animal;

    private List<VeterinarioSimpleDto> veterinario;

    private List<ConsultaSimpleDto> consulta;


}
