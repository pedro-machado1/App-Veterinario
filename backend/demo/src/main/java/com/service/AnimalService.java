package com.service;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalUpdateDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.model.*;
import com.repository.AnimalRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class AnimalService {
    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ConsultaService consultaService;

    @Transactional
    public AnimalDto insert(AnimalDto animalDto){
        Animal animal = convertToEntity(animalDto, Animal.class);
        animal = animalRepository.save(animal);
        return convertToEntity(animal, AnimalDto.class);
    }
    @Transactional
    public Optional<AnimalDto> findById(long id){
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado "+ id));
        return Optional.of(convertToDto(animal, AnimalDto.class));
    }

    @Transactional
    public Page<AnimalDto> findAll(Pageable pages){
        Page<Animal> animais = animalRepository.findAll(pages);
        return animais.map(animal -> convertToDto(animal, AnimalDto.class));
    }

    @Transactional
    public AnimalDto update(long id, AnimalUpdateDto animalDto){
        existsById(id);
        Animal animal = animalRepository.getReferenceById(id);
        convertToEntityVoid(animalDto, animal);
        animal = animalRepository.save(animal);
        return convertToDto(animal, AnimalDto.class);
    }
    @Transactional
    public void delete(long id){
        existsById(id);
        try {
            animalRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este cliente devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o cliente");
        }
    }
    @Transactional
    public void existsById(Long id){
        if (!animalRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

    @Transactional
    public AnimalDto addCliente(Long idAnimal, Long idCliente) {
        existsById(idAnimal);
        ClienteSimpleDto cliente = convertToDto(
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente)), ClienteSimpleDto.class
        );

        AnimalDto animalDto = convertToDto( animalRepository.getReferenceById(idAnimal), AnimalDto.class);
        if (animalDto.getCliente() == null) {
            animalDto.setCliente(new HashSet<>());
        }
        if (animalDto.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente já está cadastrado no Animal");
        }
        animalDto.getCliente().add(cliente);
        Animal animalentity = convertToEntity(animalDto, Animal.class);

        animalentity = animalRepository.save(animalentity);

        return convertToDto(animalentity, AnimalDto.class);
    }
    @Transactional
    public void removeCliente(Long idAnimal, Long idCliente) {
        existsById(idAnimal);
        ClienteSimpleDto cliente = convertToDto(
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente)), ClienteSimpleDto.class
        );
        AnimalDto animalDto = convertToDto( animalRepository.getReferenceById(idAnimal), AnimalDto.class);
        if (animalDto.getCliente() == null) {
            throw new DataBaseException("Animal não possui clientes cadastrados");
        }
        if (!animalDto.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente não está cadastrado no animal");
        }
        animalDto.getCliente().remove(cliente);
        Animal animalentity = convertToEntity(animalDto, Animal.class);
        animalRepository.save(animalentity);

    }
    @Transactional
    public Page<ClienteSimpleDto> findAllCliente(long idAnimal, Pageable pages){
        existsById(idAnimal);

        Page<Cliente> clientes = animalRepository.findAllClientesByAnimalId(idAnimal, pages);

        return clientes.map(cliente -> convertToDto(cliente, ClienteSimpleDto.class));
    }

    @Transactional
    public AnimalDto addConsulta(Long idAnimal, Long idConsulta) {
        existsById(idAnimal);
        ConsultaSimpleDto consulta = convertToDto(consultaService.findById(idConsulta)
                        .orElseThrow(() -> new ResourceNotFoundException("COnsulta não encontrado com ID: " + idConsulta)), ConsultaSimpleDto.class);

        AnimalDto animalDto = convertToDto( animalRepository.getReferenceById(idAnimal), AnimalDto.class);
        if (animalDto.getCliente() == null) {
            animalDto.setCliente(new HashSet<>());
        }
        if (animalDto.getConsulta().contains(consulta)) {
            throw new DataBaseException("Consulta já está cadastrado no veterinário");
        }
        animalDto.getConsulta().add(consulta);
        Animal animalentity = convertToEntity(animalDto, Animal.class);

        animalentity = animalRepository.save(animalentity);

        return convertToDto(animalentity, AnimalDto.class);
    }
    @Transactional
    public void removeConsulta(Long idAnimal, Long idConsultorio) {
        existsById(idAnimal);
        ConsultaSimpleDto consulta = convertToDto(
                consultaService.findById(idConsultorio)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), ConsultaSimpleDto.class
        );
        AnimalDto animalDto = convertToDto( animalRepository.getReferenceById(idAnimal), AnimalDto.class);
        if (animalDto.getConsulta() == null) {
            throw new DataBaseException("Veterinário não possui Consulta cadastrados");
        }
        if (!animalDto.getConsulta().contains(consulta)) {
            throw new DataBaseException("COnsulta não está cadastrado no veterinário");
        }
        animalDto.getConsulta().remove(consulta);
        Animal animalentity = convertToEntity(animalDto, Animal.class);
        animalRepository.save(animalentity);

    }
    @Transactional
    public Page<ConsultaSimpleDto> findALlConsulta(long idAnimal, Pageable pages){
        existsById(idAnimal);

        Page<Consulta> consulta = animalRepository.findAllConsulaByAnimalId(idAnimal, pages);

        return consulta.map(consultas -> convertToDto(consultas, ConsultaSimpleDto.class));
    }
}




