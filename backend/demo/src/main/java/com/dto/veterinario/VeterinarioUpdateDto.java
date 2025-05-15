package com.dto.veterinario;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaDto;
import com.dto.consultorio.ConsultorioDto;
import com.dto.medicamento.MedicamentoDto;
import com.dto.observacao.ObservacaoDto;
import com.enums.Estado;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VeterinarioUpdateDto {
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

    private List<ObservacaoDto> observacao;

    private List<MedicamentoDto> medicamento;

    private List<ConsultaDto> consulta;

    private List<ClienteSimpleDto> clietes;

}
