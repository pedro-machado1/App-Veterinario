package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "tb_consultorio")
public class Consultorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nome;

    private String endereco;

    private String telefone;

    private String descricao;

    private LocalDateTime dataCriacao;

    private LocalDateTime datadeCadastro;

    @ManyToMany
    @JoinTable(
            name = "tb_consultorio_veterinario",
            joinColumns = @JoinColumn(name = "consultorio_id"),
            inverseJoinColumns = @JoinColumn(name = "veterinario_id")
    )
    private List<Veterinario> veterinario;

}
