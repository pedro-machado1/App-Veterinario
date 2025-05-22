package com.service;


import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioUpdateDto;
import com.model.*;
import com.repository.VeterinarioRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ConsultorioService consultorioService;

    @Transactional
    public VeterinarioDto insert(VeterinarioDto veterinarioDto){
        Veterinario veterinario = convertToEntity(veterinarioDto, Veterinario.class);
        veterinario = veterinarioRepository.save(veterinario);
        return convertToDto(veterinario, VeterinarioDto.class);

    }

    @Transactional(readOnly = true)
    public Optional<VeterinarioDto> findById(Long id){
        Veterinario veterinario = veterinarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(veterinario, VeterinarioDto.class));
    }

    @Transactional
    public Page<VeterinarioDto> findAll(Pageable pages){
        Page<Veterinario> clientes = veterinarioRepository.findAll(pages);
        return clientes.map(veterinario -> convertToDto(veterinario, VeterinarioDto.class));
    }

    @Transactional
    public VeterinarioDto update(Long id, VeterinarioUpdateDto veterinarioDto){
        existsByid(id);
        Veterinario veterinario = veterinarioRepository.getReferenceById(id);
        convertToEntityVoid(veterinarioDto, veterinario);
        veterinario = veterinarioRepository.save(veterinario);
        return convertToDto(veterinario, VeterinarioDto.class);
    }

    @Transactional
    public void delete(Long id){
        existsByid(id);
        try {
            veterinarioRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este cliente devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o cliente");
        }
    }
    @Transactional
    public void existsByid(Long id){
        if(!veterinarioRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);

        }
    }

    @Transactional
    public VeterinarioDto addCliente(Long idVeterinario, Long idCliente) {
        existsByid(idVeterinario);
        ClienteSimpleDto cliente = convertToDto(
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente)), ClienteSimpleDto.class
        );

        VeterinarioDto veterinarioDto = convertToDto( veterinarioRepository.getReferenceById(idVeterinario), VeterinarioDto.class);
        if (veterinarioDto.getCliente() == null) {
            veterinarioDto.setCliente(new ArrayList<>());
        }
        if (veterinarioDto.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente já está cadastrado no veterinário");
        }
        veterinarioDto.getCliente().add(cliente);
        Veterinario veterinarioentity = convertToEntity(veterinarioDto, Veterinario.class);

        veterinarioentity = veterinarioRepository.save(veterinarioentity);

        return convertToDto(veterinarioentity, VeterinarioDto.class);
    }
    @Transactional
    public void removeCliente(Long idVeterinario, Long idCliente) {
        existsByid(idVeterinario);
        ClienteSimpleDto cliente = convertToDto(
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente)), ClienteSimpleDto.class
        );
        VeterinarioDto veterinarioDto = convertToDto( veterinarioRepository.getReferenceById(idVeterinario), VeterinarioDto.class);
        if (veterinarioDto.getCliente() == null) {
            throw new DataBaseException("Veterinário não possui clientes cadastrados");
        }
        if (!veterinarioDto.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente não está cadastrado no veterinário");
        }
        veterinarioDto.getCliente().remove(cliente);
        Veterinario veterinarioentity = convertToEntity(veterinarioDto, Veterinario.class);
        veterinarioRepository.save(veterinarioentity);

    }
    @Transactional
    public Page<ClienteSimpleDto> findAllCliente(long veterinarioId, Pageable pages){
        existsByid(veterinarioId);

        Page<Cliente> clientes = veterinarioRepository.findAllClienteByVeterinarioId(veterinarioId, pages);

        return clientes.map(cliente -> convertToDto(cliente, ClienteSimpleDto.class));
    }

    @Transactional
    public VeterinarioDto addConsultorio(Long idVeterinario, Long idConsultorio) {
        existsByid(idVeterinario);
        ConsultorioSimpleDto consultorio = convertToDto(
                consultorioService.findById(idConsultorio)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), ConsultorioSimpleDto.class
        );

        VeterinarioDto veterinarioDto = convertToDto( veterinarioRepository.getReferenceById(idVeterinario), VeterinarioDto.class);
        if (veterinarioDto.getCliente() == null) {
            veterinarioDto.setCliente(new ArrayList<>());
        }
        if (veterinarioDto.getConsultorio().contains(consultorio)) {
            throw new DataBaseException("Consultório já está cadastrado no veterinário");
        }
        veterinarioDto.getConsultorio().add(consultorio);
        Veterinario veterinarioentity = convertToEntity(veterinarioDto, Veterinario.class);

        veterinarioentity = veterinarioRepository.save(veterinarioentity);

        return convertToDto(veterinarioentity, VeterinarioDto.class);
    }
    @Transactional
    public void removeConsultorio(Long idVeterinario, Long idConsultorio) {
        existsByid(idVeterinario);
        ConsultorioSimpleDto consultorio = convertToDto(
                consultorioService.findById(idConsultorio)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), ConsultorioSimpleDto.class
        );
        VeterinarioDto veterinarioDto = convertToDto( veterinarioRepository.getReferenceById(idVeterinario), VeterinarioDto.class);
        if (veterinarioDto.getConsultorio() == null) {
            throw new DataBaseException("Veterinário não possui consultórios cadastrados");
        }
        if (!veterinarioDto.getConsultorio().contains(consultorio)) {
            throw new DataBaseException("Consultório não está cadastrado no veterinário");
        }
        veterinarioDto.getConsultorio().remove(consultorio);
        Veterinario veterinarioentity = convertToEntity(veterinarioDto, Veterinario.class);
        veterinarioRepository.save(veterinarioentity);

    }
    @Transactional
    public Page<ConsultorioSimpleDto> findAllConsultorio(long veterinarioId, Pageable pages){
        existsByid(veterinarioId);

        Page<Consultorio> consultorio = veterinarioRepository.findAllConsultorioByVeterinarioId(veterinarioId, pages);

        return consultorio.map(consultorios -> convertToDto(consultorios, ConsultorioSimpleDto.class));
    }
}




