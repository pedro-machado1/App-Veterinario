package com.model;


import com.enums.Estado;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "tb_veterinario")
public class Veterinario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String cpf;

    private int CRVM;

    private String nome;

    private String email;

    private String telefone;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private String endereco;


    @OneToMany(mappedBy = "veterinario", cascade = CascadeType.ALL)
    private List<Consulta> consulta;

    @ManyToMany
    @JoinTable(
            name = "tb_veterinario_consultorio",
            joinColumns = @JoinColumn(name = "veterinario_id"),
            inverseJoinColumns = @JoinColumn(name = "consultorio_id")
    )
    private List<Consultorio> consultorio;

    @ManyToMany
    @JoinTable(
            name = "tb_veterinario_cliente",
            joinColumns = @JoinColumn(name = "veterinario_id"),
            inverseJoinColumns = @JoinColumn(name = "cliente_id")
    )
    private List<Cliente> cliente;

    @OneToMany(mappedBy = "veterinario", cascade = CascadeType.ALL)
    private List<Observacao> observacao;
}
