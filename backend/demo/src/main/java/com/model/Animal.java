package com.model;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "tb_animal")
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

    private String doenca;

    private String alergia;

    private String raca;

    @ManyToMany
    @JoinTable(
            name = "tb_animal_cliente",
            joinColumns = @JoinColumn(name = "animal_id"),
            inverseJoinColumns = @JoinColumn(name = "cliente_id")
    )
    private List<Cliente> cliente;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    private List<Observacao> observacao;

    @OneToOne (mappedBy = "animal", cascade = CascadeType.ALL)
    private VacinaItem vacina;

}
