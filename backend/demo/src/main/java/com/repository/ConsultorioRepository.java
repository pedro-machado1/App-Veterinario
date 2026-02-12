package com.repository;

import com.model.Cliente;
import com.model.Consultorio;
import com.model.Estado;
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

    Page<Consultorio> findAllByEstado(Estado estado, Pageable pageable);

    @Query("SELECT DISTINCT cl FROM Consultorio c JOIN c.cliente cl WHERE c.id = :consultorioId")
    Page<Cliente> findAllClienteByConsultorioId(@Param("consultorioId") Long consultorioId, Pageable pageable);

    @Query("SELECT DISTINCT cl FROM Consultorio c JOIN c.cliente cl WHERE c.id = :consultorioId AND cl.cidade.idIbge = :cidadeId")
    Page<Cliente> findAllClienteByConsultorioIdAndCidadeId(@Param("consultorioId") Long consultorioId, @Param("cidadeId") Long cidadeId, Pageable pageable);

    @Query("SELECT DISTINCT cl FROM Consultorio c JOIN c.cliente cl WHERE c.id = :consultorioId AND cl.cpf LIKE CONCAT('%', :cpf, '%')")
    Page<Cliente> findAllClienteByConsultorioIdAndCpf(@Param("consultorioId") Long consultorioId, @Param("cpf") String cpf, Pageable pageable);

    @Query("SELECT DISTINCT cl FROM Consultorio c JOIN c.cliente cl WHERE c.id = :consultorioId AND cl.cpf LIKE CONCAT('%', :cpf, '%') AND cl.cidade.idIbge = :cidadeId")
    Page<Cliente> findAllClienteByConsultorioIdAndCpfAndCidadeId(@Param("consultorioId") Long consultorioId, @Param("cpf") String cpf, @Param("cidadeId") Long cidadeId, Pageable pageable);

    Page<Consultorio> findByNomeStartingWith(String nome, Pageable pageable);

    Page<Consultorio> findByEstadoAndNomeStartingWith(Estado estado, String nome, Pageable pageable);

    Page<Consultorio> findByCidadeIdIbgeAndNomeStartingWith(Long idIbge, String nome, Pageable pageable);

    Page<Consultorio> findByEstadoAndCidadeIdIbgeAndNomeStartingWith(Estado estado, Long idIbge, String nome, Pageable pageable);
}
