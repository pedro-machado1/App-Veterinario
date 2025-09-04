package com.model;


import com.enums.Estado;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "tb_veterinario")
public class Veterinario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String cpf;

    private String crvm;

    private String nome;

    private String telefone;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private String endereco;

    private LocalDate dataDeNascimento;

    private String imagem;


    @OneToMany(mappedBy = "veterinario", cascade = CascadeType.ALL)
    private List<Consulta> consulta;

    @ManyToMany
    @JoinTable(
            name = "tb_veterinario_consultorio",
            joinColumns = @JoinColumn(name = "veterinario_id"),
            inverseJoinColumns = @JoinColumn(name = "consultorio_id")
    )
    private List<Consultorio> consultorio;

    @OneToMany(mappedBy = "veterinario", cascade = CascadeType.ALL)
    private List<Observacao> observacao;

    @OneToOne(mappedBy = "veterinario", cascade = CascadeType.ALL)
    private Users users;
}
