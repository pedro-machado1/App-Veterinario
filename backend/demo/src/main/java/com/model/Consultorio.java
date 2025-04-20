package com.model;

import jakarta.persistence.*;
import lombok.Data;

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

    @ManyToMany(mappedBy = "consultorio")
    private List<Veterinario> veterinario;

}
