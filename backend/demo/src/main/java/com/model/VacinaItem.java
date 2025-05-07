package com.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_vacina_item")
public class VacinaItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String descricao;

    private LocalDateTime dataAplicacao;

    private LocalDateTime dataValidade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vacina_id")
    private Vacina vacina;
}
