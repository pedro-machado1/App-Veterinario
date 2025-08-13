package com.fixtures;

import com.model.VacinaItem;

import java.util.Date;

public class VacinaItemFixture {

    public static VacinaItem vacinaItemFixture() {
        VacinaItem vi = new VacinaItem();
        vi.setNome("Dose 1 - Antirrábica");
        vi.setDescricao("Primeira dose aplicada.");
        vi.setDataAplicacao(new Date());
        vi.setDataValidade(new Date(System.currentTimeMillis() + 365L * 24 * 60 * 60 * 1000));
        return vi;
    }
}
