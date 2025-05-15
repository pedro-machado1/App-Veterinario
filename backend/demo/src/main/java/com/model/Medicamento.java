package com.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Data
@Entity
@Table(name = "tb_medicamento")
public class Medicamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String descricao;

    @OneToMany(mappedBy = "medicamento", cascade = CascadeType.ALL)
    private List<MedicamentoItem> medicamentoItem;

}
