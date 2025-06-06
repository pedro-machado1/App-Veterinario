package com.service;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.consulta.ConsultaUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Animal;
import com.model.Cliente;
import com.model.Consulta;
import com.model.Veterinario;
import com.repository.AnimalRepository;
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
import java.util.ArrayList;
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

    @Autowired
    private AnimalService animalService;

    @Transactional
    public ConsultaDto insert(ConsultaDto consultaDTO) {

        ClienteSimpleDto cliente = convertToDto(clienteService.findById(consultaDTO.getCliente().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o cliente da consulta" + consultaDTO.getCliente().getId() + " não foi encontrado."))
                , ClienteSimpleDto.class);
        VeterinarioSimpleDto veterinario = convertToDto(veterinarioService.findById(consultaDTO.getVeterinario().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o veterinário da consulta" + consultaDTO.getVeterinario().getId() + " não foi encontrado."))
                , VeterinarioSimpleDto.class);

        consultaDTO.setDataCriacao(LocalDateTime.now());
        consultaDTO.setCliente(cliente);
        consultaDTO.setVeterinario(veterinario);
        Consulta consulta = convertToEntity(consultaDTO, Consulta.class);
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

        ClienteSimpleDto cliente = convertToDto(clienteService.findById(consultaDto.getCliente().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o cliente da consulta" + consultaDto.getCliente().getId() + " não foi encontrado."))
                , ClienteSimpleDto.class);

        VeterinarioSimpleDto veterinario = convertToDto(veterinarioService.findById(consultaDto.getVeterinario().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o veterinário da consulta" + consultaDto.getVeterinario().getId() + " não foi encontrado."))
                , VeterinarioSimpleDto.class);

        consultaDto.setVeterinario(veterinario);
        consultaDto.setCliente(cliente);
        consultaDto.setDataAlteracao(LocalDateTime.now());
        Consulta consultaaux = convertToEntity(consultaRepository.getReferenceById(id), Consulta.class);
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

    @Transactional
    public ConsultaDto addAnimal(Long idConsulta, Long idAnimal) {
        existsById(idConsulta);
        AnimalSimpleDto animal = convertToDto(animalService.findById(idAnimal)
                .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class);

        ConsultaDto consultaDto = convertToDto( consultaRepository.getReferenceById(idConsulta), ConsultaDto.class);
        if (consultaDto.getAnimal() == null) {
            consultaDto.setAnimal(new ArrayList<>());
        }
        if (consultaDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Consulta já está cadastrado no veterinário");
        }
        consultaDto.getAnimal().add(animal);
        Consulta consultaentity = convertToEntity(consultaDto, Consulta.class);

        consultaentity = consultaRepository.save(consultaentity);

        return convertToDto(consultaentity, ConsultaDto.class);
    }
    @Transactional
    public void removeAnimal(Long idConsulta, Long idAnimal) {
        existsById(idConsulta);
        AnimalSimpleDto animal = convertToDto(animalService.findById(idAnimal)
                .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class);

        ConsultaDto consultaDto = convertToDto( consultaRepository.getReferenceById(idConsulta), ConsultaDto.class);
        if (consultaDto.getAnimal() == null) {
            throw new DataBaseException("Consulta não possui Consulta cadastrados");
        }
        if (!consultaDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Animal não está cadastrado no veterinário");
        }
        consultaDto.getAnimal().remove(animal);
        Consulta consultaentity = convertToEntity(consultaDto, Consulta.class);
        consultaRepository.save(consultaentity);

    }
    @Transactional
    public Page<AnimalSimpleDto> findALlAnimal(long idConsulta, Pageable pages){
        existsById(idConsulta);

        Page<Animal> animal = consultaRepository.findAllConsultaByVeterinario(idConsulta, pages);

        return animal.map(animais -> convertToDto(animais, AnimalSimpleDto.class));
    }

}
