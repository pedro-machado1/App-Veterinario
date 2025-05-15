package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "tb_consulta")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String titulo;

    private String texto;

    private LocalDate dataCriacao;

    private LocalDate dataAlteracao;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    private List<MedicamentoItem> medicamentoItem;

    @ManyToMany(mappedBy = "consulta")
    private List<Animal> animal;

    @ManyToOne
    @JoinColumn(name = "veterinario_id")
    private Veterinario veterinario;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

}
