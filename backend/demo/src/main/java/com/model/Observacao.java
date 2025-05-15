package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tb_observacao")
public class Observacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String texto;


    private LocalDateTime dataCriacao;

    private LocalDateTime dataAlteracao;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "animal_id")
    private Animal animal;
}
