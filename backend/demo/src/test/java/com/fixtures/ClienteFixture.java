package com.fixtures;

import com.model.Cliente;

import java.time.LocalDate;

public class ClienteFixture {

    public static Cliente clienteFixture() {
        Cliente c = new Cliente();
        c.setCpf("000.000.000-00");
        c.setNome("Cliente de Teste");
        c.setEmail("email@example.com");
        c.setEndereco("Rua Exemplo, 123");
        c.setTelefone("(00) 00000-0000");
        c.setDataDeNascimento(LocalDate.now().minusYears(30));
        c.setDataDeCriacao(LocalDate.now());
        c.setDataDeAlteracao(LocalDate.now());
        return c;
    }
}
