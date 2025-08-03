package com.dto.veterinario;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.dto.observacao.ObservacaoSimpleDto;
import com.enums.Estado;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class VeterinarioDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull(message = "Informe o CPF de veterinario")
    private String cpf;

    @NotBlank(message = "Informe o nome")
    private String nome;

    @NotBlank(message = "Informe o CRVM")
    private String CRVM;

    @NotNull(message = "Informe o estado em atual")
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @NotBlank(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    @NotNull(message = "Informe a sua data de nascimento")
    private LocalDate dataDeNascimento;

    private String endereco;


    private List<ConsultorioSimpleDto> consultorio;

    private List<ObservacaoSimpleDto> observacao;

    private List<MedicamentoSimpleDto> medicamento;

    private List<ConsultaSimpleDto> consulta;

    private List<ClienteSimpleDto> cliente;
}
