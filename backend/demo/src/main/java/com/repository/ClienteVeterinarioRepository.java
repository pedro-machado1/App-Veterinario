package com.repository;

import com.model.ClienteVeterinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteVeterinarioRepository extends JpaRepository<ClienteVeterinario, Long> {

    boolean existsByClienteIdAndVeterinarioId(Long clienteId, Long veterinarioId);

    void deleteByClienteIdAndVeterinarioId(Long clienteId, Long veterinarioId);

    List<ClienteVeterinario> findAllByClienteId(Long clienteId);

    List<ClienteVeterinario> findAllByVeterinarioId(Long veterinarioId);
}