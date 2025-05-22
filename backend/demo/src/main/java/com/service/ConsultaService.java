package com.service;

import com.dto.consulta.ConsultaDto;
import com.dto.consulta.ConsultaUpdateDto;
import com.model.Cliente;
import com.model.Consulta;
import com.model.Veterinario;
import com.repository.ClienteRepository;
import com.repository.ConsultaRepository;
import com.repository.VeterinarioRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class ConsultaService {


    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VeterinarioService veterinarioService;

    @Transactional
    public ConsultaDto insert(ConsultaDto consultaDTO) {
        Consulta consulta = convertToEntity(consultaDTO, Consulta.class);
        consulta.setDataCriacao(LocalDateTime.now());

        Cliente cliente = convertToEntity(clienteService.findById(consultaDTO.getCliente().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o cliente da consulta" + consultaDTO.getCliente().getId() + " não foi encontrado."))
                , Cliente.class);

        Veterinario veterinario = convertToEntity(veterinarioService.findById(consultaDTO.getVeterinario().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o veterinário da consulta" + consultaDTO.getVeterinario().getId() + " não foi encontrado."))
                , Veterinario.class);

        consulta.setCliente(cliente);
        consulta.setVeterinario(veterinario);
        consulta = consultaRepository.save(consulta);
        return convertToDto(consulta, ConsultaDto.class);
    }
    @Transactional(readOnly = true)
    public Optional<ConsultaDto> findById(Long id){
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(consulta, ConsultaDto.class));
    }

    @Transactional
    public Page<ConsultaDto> findAll(Pageable pages){
        Page<Consulta> consultas = consultaRepository.findAll(pages);
        return consultas.map(consulta -> convertToDto(consulta, ConsultaDto.class));
    }

    @Transactional
    public ConsultaDto update(Long id, ConsultaUpdateDto consultaDto){
        existsById(id);
        Consulta consultaaux = convertToEntity(consultaRepository.getReferenceById(id), Consulta.class);

        Cliente cliente = convertToEntity(clienteService.findById(consultaaux.getCliente().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o cliente da consulta" + consultaaux.getCliente().getId() + " não foi encontrado."))
                , Cliente.class);

        Veterinario veterinario = convertToEntity(veterinarioService.findById(consultaaux.getVeterinario().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o veterinário da consulta" + consultaaux.getVeterinario().getId() + " não foi encontrado."))
                , Veterinario.class);

        consultaaux.setVeterinario(veterinario);
        consultaaux.setCliente(cliente);
        consultaaux.setDataAlteracao(LocalDateTime.now());
        Consulta consulta =convertToEntity(consultaaux, Consulta.class);

        convertToEntityVoid(consultaDto, consulta);
        consulta = consultaRepository.save(consulta);
        return convertToDto(consulta, ConsultaDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            consultaRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este consulta devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o consulta");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!consultaRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

}
