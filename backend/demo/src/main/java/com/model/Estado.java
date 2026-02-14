package com.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

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
    private String nome;

    @NotNull(message = "Latitude não pode ser nula")
    private Double latitude;

    @NotNull(message = "Longitude não pode ser nula")
    private Double longitude;

    @NotBlank(message = "Região não pode ser vazia")
    private String regiao;

    @OneToMany(mappedBy = "estado")
    private List<Consultorio> consultorio;

    @OneToMany(mappedBy = "estado")
    private List<Cliente> cliente;

    @OneToMany(mappedBy = "estado")
    private List<Veterinario> veterinario;
}