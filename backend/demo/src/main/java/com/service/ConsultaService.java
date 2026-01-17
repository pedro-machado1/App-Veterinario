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
import com.repository.*;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.PermissionException;
import com.service.exceptions.ResourceNotFoundException;
import jdk.jfr.Experimental;
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
    private ClienteVeterinarioService clienteVeterinarioService;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VeterinarioService veterinarioService;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private UsersService usersService;

    @Transactional
    public ConsultaDto insert(ConsultaDto consultaDTO) throws Exception {
        if (!clienteVeterinarioService.existeVinculo(consultaDTO.getCliente().getId(), consultaDTO.getVeterinario().getId())) {
            throw new PermissionException("O veterinario não tem permissão para fazer essa ação");
        }
        Consulta consulta = convertToEntity(consultaDTO, Consulta.class);
        Optional<Cliente> clienteOptional = clienteService.findById(consultaDTO.getCliente().getId());
        if (clienteOptional.isEmpty()) return null;
        Cliente cliente = clienteOptional.get();
            Veterinario veterinario = usersService.findUsers().getVeterinario();
        consulta.setDataCriacao(LocalDate.now());
        consulta.setCliente(cliente);
        consulta.setVeterinario(veterinario);
        consulta = consultaRepository.save(consulta);
        return convertToDto(consulta, ConsultaDto.class);
    }
    @Transactional(readOnly = true)
    public Optional<Consulta> findById(Long id){
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(consulta);
    }

    @Transactional
    public Page<ConsultaDto> findAll(Pageable pages){
        Page<Consulta> consultas = consultaRepository.findAll(pages);
        return consultas.map(consulta -> convertToDto(consulta, ConsultaDto.class));
    }

    @Transactional
    public ConsultaDto update(Long id, ConsultaUpdateDto consultaDto){
        existsById(id);
        Consulta consultaSalva = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta não encontrada: " + id));

        Veterinario veterinarioAutenticado = usersService.findUsers().getVeterinario();

        if (consultaSalva.getVeterinario().getId() != veterinarioAutenticado.getId()) {
            throw new DataIntegrityViolationException("Somente o veterinário que criou a consulta pode modificá-la");
        }

        ClienteSimpleDto clienteDto = convertToDto(clienteService.findById(consultaDto.getCliente().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o cliente da consulta" + consultaDto.getCliente().getId() + " não foi encontrado."))
                , ClienteSimpleDto.class);
        VeterinarioSimpleDto veterinarioDto = convertToDto(veterinarioService.findById(consultaDto.getVeterinario().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado para o veterinário da consulta" + consultaDto.getVeterinario().getId() + " não foi encontrado."))
                , VeterinarioSimpleDto.class);

        consultaDto.setVeterinario(veterinarioDto);
        consultaDto.setCliente(clienteDto);
        consultaDto.setDataAlteracao(LocalDate.now());

        convertToEntityVoid(consultaDto, consultaSalva);
        Consulta consulta = consultaRepository.save(consultaSalva);
        return convertToDto(consulta, ConsultaDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta não encontrada: " + id));

        Veterinario veterinarioAutenticado = usersService.findUsers().getVeterinario();

        if (consulta.getVeterinario().getId() != veterinarioAutenticado.getId()) {
            throw new DataIntegrityViolationException("Somente o veterinário que criou a consulta pode excluí-la");
        }

        try {
            consultaRepository.deleteById(id);
        } catch (Exception e) {
            throw new DataBaseException("A consulta não pode ser deletada ");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!consultaRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

    @Transactional
    public ConsultaDto addAnimal(Long idConsulta, Long idAnimal){
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
    public void removeAnimal(Long idConsulta, Long idAnimal){
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
