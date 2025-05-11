package com.model;

import com.dto.medicamentoItemdto.MedicamentoItemSimpleDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonManagedReference
    private List<MedicamentoItem> medicamentoItem;

}
