package com.repository;

import com.model.VacinaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface VacinaItemRepository extends JpaRepository<VacinaItem, Long> {
    Page<VacinaItem> findAllByAnimalId(Long animalId, Pageable pageable);
}
