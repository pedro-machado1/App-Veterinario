package com.fixtures;

import com.model.Medicamento;

public class MedicamentoFixture {

    public static Medicamento medicamentoFixture() {
        Medicamento m = new Medicamento();
        m.setNome("Amoxicilina");
        m.setDescricao("Antibiótico de amplo espectro.");
        return m;
    }
}
