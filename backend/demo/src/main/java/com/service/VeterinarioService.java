package com.service;


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

import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private ConsultorioService cosultorioRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AnimalService animalService;

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


}
