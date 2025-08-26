package com.fixtures;

import com.model.Consultorio;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ConsultorioFixture {

    public static Consultorio consultorioFixture() {
        Consultorio cs = new Consultorio();
        cs.setNome("Consultório Central");
        cs.setEndereco("Av. Principal, 456");
        cs.setTelefone("(11) 11111-1111");
        cs.setDescricao("Consultório veterinário para pequenos animais.");
        cs.setDataDeFundacao(LocalDate.now().minusMonths(1));
        cs.setDataDeCadastro(LocalDate.now().minusDays(10));
        return cs;
    }
}
