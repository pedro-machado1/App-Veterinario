package com.model;

import com.dto.vacinaItemdto.VacinaItemSimpleDto;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.time.LocalDateTime;
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

    @OneToMany(mappedBy = "vacina")
    private List<VacinaItem> vacinaItem;

}
