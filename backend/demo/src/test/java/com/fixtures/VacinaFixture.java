package com.fixtures;

import com.model.Vacina;

public class VacinaFixture {

    public static Vacina vacinaFixture() {
        Vacina v = new Vacina();
        v.setNome("Antirrábica");
        v.setDescricao("Vacina contra raiva.");
        v.setValidade(365);
        return v;
    }
}
