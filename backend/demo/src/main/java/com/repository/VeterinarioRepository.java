package com.repository;

import com.model.Cliente;
import com.model.Consultorio;
import com.model.Veterinario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VeterinarioRepository extends JpaRepository<Veterinario, Long> {
    @Query("SELECT c FROM Cliente c JOIN c.veterinario v WHERE v.id = :veterinarioId")
    Page<Cliente> findAllClienteByVeterinarioId(@Param("veterinarioId") Long veterinarioId, Pageable pageable);

}
