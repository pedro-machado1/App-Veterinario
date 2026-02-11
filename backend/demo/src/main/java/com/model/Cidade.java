package com.model;

import com.model.Cliente;
import com.model.Estado;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "tb_cidade")
@NoArgsConstructor
public class Cidade {

    @Id
    private Long idIbge;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "latitude", nullable = false)
    private Float latitude;

    @Column(name = "longitude", nullable = false)
    private Float longitude;

    @Column(name = "capital", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean capital;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "codigo_uf", referencedColumnName = "codigo_uf")
    private Estado estado;

    @Column(name = "siafi_id", nullable = false, unique = true)
    private String siafiId;

    @Column(name = "ddd", nullable = false)
    private Integer ddd;

    @Column(name = "fuso_horario", nullable = false)
    private String fusoHorario;

    @OneToMany(mappedBy = "cidade")
    private List<Cliente> cliente;
}
