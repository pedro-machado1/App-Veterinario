package com.veterinario.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "observacao")
public class Observacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String texto;


    private LocalDateTime creationDate;

    private LocalDateTime updateDate;

    @ManyToOne
    private Veterinario veterinario;

    @ManyToOne
    private Animal animal;
}
