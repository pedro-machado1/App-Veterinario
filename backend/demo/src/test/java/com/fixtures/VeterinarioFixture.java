package com.fixtures;

import com.enums.Estado;
import com.model.Veterinario;

import java.time.LocalDate;

public class VeterinarioFixture {

    public static Veterinario veterinarioFixture() {
        Veterinario v = new Veterinario();
        v.setCpf("111.111.111-11");
        v.setCrvm("CRMV-000000");
        v.setNome("Dra. Veterinária");
        v.setTelefone("(22) 22222-2222");
        // Caso precise, ajuste o estado conforme os valores disponíveis no enum Estado
        // v.setEstado(Estado.SP);
        v.setEndereco("Rua das Clínicas, 789");
        v.setDataDeNascimento(LocalDate.now().minusYears(35));
        return v;
    }
}
