package com.repository;

import com.model.MedicamentoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicamentoItemRepository extends JpaRepository<MedicamentoItem, Long> {
}
