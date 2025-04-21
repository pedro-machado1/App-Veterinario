package com.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Date;
import java.time.LocalDateTime;


@Entity
@Table(name = "tb_vacina")
public class Vacina {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String nome;

    private String descricao;

    private int validade;

}
