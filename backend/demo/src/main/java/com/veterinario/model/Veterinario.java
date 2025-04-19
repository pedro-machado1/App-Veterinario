package com.veterinario.model;

import com.veterinario.enums.Genero;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "veterinario")
public class Veterinario {
    @Id
    private int cpf;

    private int CRVM;

    private String nome;

    private String email;

    @Enumerated(EnumType.STRING)
    private Genero estado;

    private String endereco;

    @OneToMany
    private List<Observacao> observacoes;

//    private String Hospital Veterinario;

    @OneToMany
    private List<Consulta> consulta;

    @ManyToMany
    private List<Cliente> animais;
}
