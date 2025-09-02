package com.fixtures;

import com.model.Observacao;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ObservacaoFixture {

    public static Observacao observacaoFixture() {
        Observacao o = new Observacao();
        o.setTexto("Animal apresentou bom comportamento durante o exame.");
        o.setDataCriacao(LocalDate.now().minusDays(2));
        o.setDataAlteracao(LocalDate.now());
        return o;
    }
}
