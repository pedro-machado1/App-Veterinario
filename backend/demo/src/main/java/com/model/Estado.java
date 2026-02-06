package com.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_estados")
public class Estado {

    @Id
    @Column(name = "codigo_uf")
    @NotNull(message = "Código UF não pode ser nulo")
    private Integer codigoUf;

    @NotBlank(message = "UF não pode ser vazia")
    private String uf;

    @NotBlank(message = "Nome não pode ser vazio")
    @Column(length = 100)
    private String nome;

    @NotNull(message = "Latitude não pode ser nula")
    private Double latitude;

    @NotNull(message = "Longitude não pode ser nula")
    private Double longitude;

    @NotBlank(message = "Região não pode ser vazia")
    @Column(length = 12)
    private String regiao;
}