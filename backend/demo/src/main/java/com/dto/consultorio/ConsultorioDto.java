package com.dto.consultorio;

import com.dto.users.UsersSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.model.Users;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultorioDto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private long id;

    @NotBlank(message = "Informe o nome do consultorio")
    private String nome;

    @NotNull(message = "Informe a idade do consultorio")
    private String endereco;

    @NotNull(message = "Informe o telefone do consultorio")
    private String telefone;

    @NotBlank(message = "Informe a descrição do consultorio")
    private String descricao;

    private LocalDate dataDeFundacao;

    private LocalDate dataDeCadastro;

    private List<VeterinarioSimpleDto> veterinario;

    private UsersSimpleDto users;
}
