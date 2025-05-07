package com.model;

import com.dto.vacinaItemdto.VacinaItemSimpleDto;
import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "tb_vacina")
public class Vacina {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String nome;

    private String descricao;

    private int validade;

    @OneToMany(mappedBy = "vacina",cascade = CascadeType.ALL)
    private List<VacinaItem> vacina;

}
