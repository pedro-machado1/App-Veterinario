package com.dto.consultorio;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultorioDto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private int id;
    @NotBlank(message = "Informe o nome do consultorio")
    private String nome;
    @NotNull(message = "Informe a idade do consultorio")
    private String endereco;
    @NotNull(message = "Informe o telefone do consultorio")
    private String telefone;
    @NotBlank(message = "Informe a descrição do consultorio")
    private String descricao;
}
