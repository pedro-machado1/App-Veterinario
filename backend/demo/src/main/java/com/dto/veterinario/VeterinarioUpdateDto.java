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
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VeterinarioUpdateDto {
    private String cpf;

    private String nome;

    private String CRVM;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private String email;

    private String telefone;

    private String endereco;


}
