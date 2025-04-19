package com.veterinario.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "consulta")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String texto;

    private LocalDateTime CreationDate;

    @OneToMany
    private List<Medicamento> medicamento;

    @ManyToOne
    private Animal animal;

}
