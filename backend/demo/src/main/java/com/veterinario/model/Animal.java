package com.veterinario.model;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "animal")
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nome;

    private String especie;

    private int idade;

    private int peso;

    private int altura;

    private int comprimento;

    @ManyToOne
    private Cliente cliente;

    @OneToMany
    private List<Observacao> observacao;


}
