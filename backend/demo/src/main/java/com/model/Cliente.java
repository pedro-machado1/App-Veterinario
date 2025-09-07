package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "tb_cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String cpf;

    private String nome;

    private String endereco;

    private String telefone;

    private LocalDate dataDeNascimento;

    private LocalDate dataDeCriacao;

    private LocalDate dataDeAlteracao;

    private String imagem;

    @ManyToMany
    @JoinTable(
            name = "tb_cliente_animal",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "animal_id")
    )
    private List<Animal> animal;

    @ManyToMany (mappedBy = "cliente")
    private List<Consultorio> Consultorio;

    @OneToMany(mappedBy = "cliente")
    private List<Consulta> consulta;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    private Users users;


}
