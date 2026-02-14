package com.repository;

import com.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoRepository extends JpaRepository<Estado, Integer> {
    Optional<Estado> findByUfIgnoreCase(String uf);

    Optional<Estado> findByCodigoUf(int codigoUF);
}