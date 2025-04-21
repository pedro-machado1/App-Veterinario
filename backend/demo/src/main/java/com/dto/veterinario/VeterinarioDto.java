package com.dto.veterinario;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaDto;
import com.dto.consultorio.ConsultorioDto;
import com.dto.medicamento.MedicamentoDto;
import com.dto.observacoes.ObservacoesDto;
import com.enums.Estado;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class VeterinarioDto {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private long id;

    @NotNull(message = "Informe o CPF de veterinario")
    private int cpf;

    @NotBlank(message = "Informe o nome")
    private String nome;

    @NotNull(message = "Informe o CRVM")
    private int CRVM;

    @NotNull(message = "Informe o estado em atua")
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @NotBlank(message = "Informe o seu email")
    private String email;

    @NotBlank(message = "Informe o seu telefone")
    private String telefone;

    private String endereco;

    private ConsultorioDto consultorio;

    private List<ObservacoesDto> observacao;

    private List<MedicamentoDto> medicamento;

    private List<ConsultaDto> consulta;

    private List<ClienteSimpleDto> clietes;
}
