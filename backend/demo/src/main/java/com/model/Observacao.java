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

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "veterinario_id")
    private Veterinario veterinario;
}
