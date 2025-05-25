package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
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

    private LocalDateTime dataCriacao;

    private LocalDateTime dataAlteracao;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    private List<MedicamentoItem> medicamentoItem;

    @ManyToMany
    @JoinTable(
            name = "tb_consulta_animal",
            joinColumns = @JoinColumn(name = "consulta_id"),
            inverseJoinColumns = @JoinColumn(name = "animal_id")
    )
    private List<Animal> animal;

    @ManyToOne
    @JoinColumn(name = "veterinario_id")
    private Veterinario veterinario;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

}
