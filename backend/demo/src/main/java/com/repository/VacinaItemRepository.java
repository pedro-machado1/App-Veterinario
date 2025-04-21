package com.repository;

import com.model.VacinaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VacinaItemRepository extends JpaRepository<VacinaItem, Long> {
}
