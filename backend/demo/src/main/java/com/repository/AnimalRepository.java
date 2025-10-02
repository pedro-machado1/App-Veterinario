package com.repository;

import com.model.Animal;
import com.model.Cliente;
import com.model.Consulta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    @Query("SELECT c FROM Consulta c JOIN c.animal a WHERE a.id = :animalId")
    Page<Consulta> findAllConsultaByAnimalId(@Param("animalId") Long animalId, Pageable pageable);
}
