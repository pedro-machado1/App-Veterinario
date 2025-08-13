package com.fixtures;

import com.model.Animal;
import com.model.Consulta;
import com.model.MedicamentoItem;
import com.model.Medicamento;

public class MedicamentoItemFixture {

    public static MedicamentoItem medicamentoItemFixture() {
        MedicamentoItem mi = new MedicamentoItem();
        mi.setNome("Amoxicilina 500mg");
        mi.setDescricao("Administrar duas vezes ao dia por 7 dias.");
        mi.setQuantidade(14);
        return mi;
    }

    public static MedicamentoItem medicamentoItemFixture(Medicamento medicamento, Animal animal, Consulta consulta) {
        MedicamentoItem mi = medicamentoItemFixture();
        mi.setMedicamento(medicamento);
        mi.setAnimal(animal);
        mi.setConsulta(consulta);
        return mi;
    }
}
