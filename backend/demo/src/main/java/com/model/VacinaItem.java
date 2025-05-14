package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
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

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "vacina_id")
    private Vacina vacina;
}
