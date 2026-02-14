package com.repository;

import com.model.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Long> {

    List<Cidade> findAllByEstado_CodigoUfOrderByNomeAsc(int codigoUf);

    List<Cidade> findAllByNomeContainingIgnoreCaseOrderByNomeAsc(String nome);

}
