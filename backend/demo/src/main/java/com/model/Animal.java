package com.model;


import com.enums.Genero;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "tb_animal")
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String especie;

    private int idade;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private int altura;

    private int comprimento;

    private int peso;

    private String doenca;

    private String alergia;

    private String raca;

    private String imagem;

    @ManyToMany(mappedBy = "animal")
    private List<Cliente> cliente;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    private List<Observacao> observacao;

    @OneToMany (mappedBy = "animal", cascade = CascadeType.ALL)
    private List<VacinaItem> vacinaItem;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    private List<MedicamentoItem> medicamentoItem;

    @ManyToMany(mappedBy = "animal")
    private List<Consulta> consulta;


}
