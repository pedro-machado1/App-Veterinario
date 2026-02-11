package com.dto.consultorio;

import com.dto.cidade.CidadeSimpleDto;
import com.dto.estado.EstadoSimpleDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultorioUpdateDto {
    private String nome;

    private String endereco;

    private String telefone;

    private String descricao;

    private String cep;

    private CidadeSimpleDto cidade;

    private EstadoSimpleDto estado;

    private LocalDate dataDeFundacao;

    private LocalDate dataDeCadastro;

    private String imagem;


}
