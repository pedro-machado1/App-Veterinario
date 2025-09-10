package com.repository;

import com.model.Cliente;
import com.model.Consulta;
import com.model.Consultorio;
import com.model.Veterinario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VeterinarioRepository extends JpaRepository<Veterinario, Long> {

    @Query("SELECT DISTINCT ca FROM Veterinario v JOIN v.consulta ca WHERE v.id = :veterinarioId")
    Page<Consulta> findAllConsultaByVeterinario(@Param("veterinarioId") long veterinarioId, Pageable pageable) ;


}
