package com.repository;

import com.model.MedicamentoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface MedicamentoItemRepository extends JpaRepository<MedicamentoItem, Long> {

    Page<MedicamentoItem> findAllByAnimalId(Long animalId, Pageable pageable);
}
