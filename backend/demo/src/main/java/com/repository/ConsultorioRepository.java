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
public interface ConsultorioRepository extends JpaRepository<Consultorio, Long> {
    @Query("SELECT DISTINCT v FROM Consultorio c JOIN c.veterinario v WHERE c.id = :consultorioId")
    Page<Veterinario> findAllVeterinarioByConsultorioId(@Param("consultorioId") Long consultorioId, Pageable pageable);


}
