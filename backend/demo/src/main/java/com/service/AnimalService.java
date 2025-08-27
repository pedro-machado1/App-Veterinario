package com.service;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalUpdateDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.users.Usersdto;
import com.model.*;
import com.repository.AnimalRepository;
import com.security.service.AuthenticationService;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.antlr.v4.runtime.misc.Array2DHashSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class AnimalService {
    @Autowired
    private AnimalRepository animalRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @Transactional
    public AnimalDto insert(AnimalDto animalDto){
        Animal animal = convertToEntity(animalDto, Animal.class);
        animal = animalRepository.save(animal);
        return convertToDto(animal, AnimalDto.class);
    }
    @Transactional
    public Optional<AnimalDto> findById(long id){
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado " + id));
        return Optional.of(convertToDto(animal, AnimalDto.class));
    }

    @Transactional
    public Optional<AnimalDto> findByIdwithAuthenticate(long id){
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado " + id));
        Usersdto usersdto =authenticationService.authenticatedUser();

        if (animal.getCliente().stream().anyMatch(cliente -> cliente.getId() == usersdto.getCliente().getId())){
            return Optional.of(convertToDto(animal, AnimalDto.class));
        }
        throw new ResourceNotFoundException("Você não têm permissão para acessar este recurso");
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
        Usersdto usersdto =authenticationService.authenticatedUser();

        if (animal.getCliente().stream().anyMatch(cliente -> cliente.getId() == usersdto.getCliente().getId())) {
            convertToEntityVoid(animalDto, animal);
            animal = animalRepository.save(animal);
            return convertToDto(animal, AnimalDto.class);
        }
        else {
            return null;
        }
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
}




