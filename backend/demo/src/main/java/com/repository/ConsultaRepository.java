package com.repository;

import com.model.Animal;
import com.model.Consulta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    @Query("SELECT a FROM Animal a JOIN a.consulta c WHERE c.id = :consultaId")
    Page<Animal> findAllConsultaByVeterinario(@Param("consultaId") Long consultaId, Pageable pageable);

}
