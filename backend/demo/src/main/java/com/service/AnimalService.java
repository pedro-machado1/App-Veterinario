package com.service;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalUpdateDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.model.Animal;
import com.model.Cliente;
import com.model.Consulta;
import com.repository.AnimalRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
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
        insertOrUpdateCliente(animalDto.getCliente(), animal);
        insertOrUpdateConsulta(animalDto.getConsulta(), animal);
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
        insertOrUpdateCliente(animalDto.getCliente(), animal);
        insertOrUpdateConsulta(animalDto.getConsulta(), animal);
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
    public void existsById(long id){
        if (!animalRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }
    @Transactional
    protected void insertOrUpdateCliente(List<ClienteSimpleDto> clientedto, Animal animal) {
        if (Objects.isNull(clientedto)) {
            return;
        }
        if (Objects.nonNull(animal) && Objects.nonNull(animal.getCliente())) {
            animal.getCliente().clear();
        }
        clientedto.forEach(clienteSimpleDto -> {
            Cliente cliente = convertToEntity(clienteService.findById(clienteSimpleDto.getId()), Cliente.class);
            animal.getCliente().add(cliente);
        });
    }

    @Transactional
    protected void insertOrUpdateConsulta(List<ConsultaSimpleDto> consultadto, Animal animal) {
        if (Objects.isNull(consultadto)) {
            return;
        }
        if (Objects.nonNull(animal) && Objects.nonNull(animal.getCliente())) {
            animal.getConsulta().clear();
        }
        consultadto.forEach(consultaSimpleDto -> {
            Consulta consulta = convertToEntity(consultaService.findById(consultaSimpleDto.getId()), Consulta.class);
            animal.getConsulta().add(consulta);
        });
    }


}
