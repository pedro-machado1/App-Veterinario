package com.fixtures;

import com.model.Consulta;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ConsultaFixture {

    public static Consulta consultaFixture() {
        Consulta c = new Consulta();
        c.setTitulo("Consulta de Rotina");
        c.setTexto("Consulta de rotina para avaliação geral.");
        c.setDataCriacao(LocalDate.now().minusDays(1));
        c.setDataAlteracao(LocalDate.now());
        return c;
    }
}
