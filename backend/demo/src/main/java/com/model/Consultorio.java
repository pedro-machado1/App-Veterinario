package com.model;

import com.enums.Estado;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "tb_consultorio")
public class Consultorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String endereco;

    private String telefone;

        private String cep;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDate dataDeFundacao;

    private LocalDate dataDeCadastro;

    private Estado estado;

    private String imagem;

    @ManyToOne
    @JoinColumn(name = "cidade_id")
    private Cidade cidade;

    @OneToOne(mappedBy = "consultorio", cascade = CascadeType.ALL)
    private Users users;

    @ManyToMany
    @JoinTable(
            name = "tb_consultorio_veterinario",
            joinColumns = @JoinColumn(name = "consultorio_id"),
            inverseJoinColumns = @JoinColumn(name = "veterinario_id")
    )
    private List<Veterinario> veterinario;

    @ManyToMany
    @JoinTable(
            name = "tb_veterinario_cliente",
            joinColumns = @JoinColumn(name = "veterinario_id"),
            inverseJoinColumns = @JoinColumn(name = "cliente_id")
    )
    private List<Cliente> cliente;
}