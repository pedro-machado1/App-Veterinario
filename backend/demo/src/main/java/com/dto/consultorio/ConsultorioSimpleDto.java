package com.dto.consultorio;

import com.dto.cidade.CidadeSimpleDto;
import com.dto.estado.EstadoSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultorioSimpleDto {
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

    private String cep;

    private EstadoSimpleDto estado;

    private CidadeSimpleDto cidade;

    private LocalDate dataDeCadastro;

    private String imagem;


}
