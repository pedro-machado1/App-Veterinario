package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "tb_cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int cpf;

    private String nome;

    private String email;

    private String endereco;

    private String telefone;

    private LocalDateTime dataDeCriacao;

    private LocalDateTime dataDeAlteracao;

    @ManyToMany (mappedBy = "cliente")
    private List<Animal> animal;

    @ManyToMany (mappedBy = "cliente")
    private List<Veterinario> veterinario;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Consulta> consulta;


}
