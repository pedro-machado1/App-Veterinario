package com.repository;

import com.model.Animal;
import com.model.Cliente;
import com.model.Veterinario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT DISTINCT a FROM Cliente c JOIN c.animal a WHERE c.id = :clienteId")
    Page<Animal> findAllAnimalByCliente(@Param("clienteId") Long clienteId, Pageable pageable);

    Page<Cliente> findAllByCpf(String cpf, Pageable pageable);

}
