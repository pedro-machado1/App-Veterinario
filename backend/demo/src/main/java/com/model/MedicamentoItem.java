package com.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_medicamento_item")
public class MedicamentoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;

    private String descricao;

    private int quantidade;

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    private Consulta consulta;
}
