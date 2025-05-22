package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "tb_vacina")
public class Vacina {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String descricao;

    private int validade;

    @OneToMany(mappedBy = "vacina", cascade = CascadeType.ALL)
    private List<VacinaItem> vacinaItem;

}
