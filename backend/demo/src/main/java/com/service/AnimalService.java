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
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class AnimalService {
    @Autowired
    private AnimalRepository animalRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public AnimalDto insert(AnimalDto animalDto, MultipartFile imagem){
        String imagemString = fileStorageService.saveFile(imagem);
        animalDto.setImagem(null);
        Animal animal = convertToEntity(animalDto, Animal.class);
        if (imagemString != null )animal.setImagem(imagemString);
        animal = animalRepository.save(animal);
        return convertToDto(animal, AnimalDto.class);
    }


    @Transactional
    public Optional<Animal> findById(long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado " + id));
        return Optional.of(animal);
    }

    @Transactional
    public Optional<Animal> findByIdwithAuthenticate(long id, long idConsulta){
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado " + id));

        if (idConsulta != 0){
            if (animal.getCliente().stream().anyMatch(cliente -> cliente.getId() == idConsulta)){
                return Optional.of(animal);
            }
        }
        else {
            Usersdto usersdto =authenticationService.authenticatedUser();
            if (animal.getCliente().stream().anyMatch(cliente -> cliente.getId() == usersdto.getCliente().getId())){
                return Optional.of(animal);
            }
        }


        throw new ResourceNotFoundException("Não foi encontrado o animal");
    }

    @Transactional
    public Resource findImagemByAnimal(Animal animal){
        String imagemPath = animal.getImagem();

        if (imagemPath == null || imagemPath.isEmpty()) {
            throw new ResourceNotFoundException("Imagem não encontrada");
        }

        return fileStorageService.loadFileAsResource(imagemPath);

    }

    @Transactional
    public Page<AnimalDto> findAll(Pageable pages){
        Page<Animal> animais = animalRepository.findAll(pages);
        return animais.map(animal -> convertToDto(animal, AnimalDto.class));
    }

    @Transactional
    public AnimalDto update(long id, AnimalUpdateDto animalDto, MultipartFile imagem){
        String imagemString = fileStorageService.saveFile(imagem);
        existsById(id);
        Optional<Animal> animalOptional = animalRepository.findById(id);
        if (animalOptional.isEmpty()) throw new ResourceNotFoundException("Animal não encontrado");
        Animal animal = animalOptional.get();
        if (imagemString == null ) imagemString = animal.getImagem();
        else fileStorageService.deleteFile(animal.getImagem());
        Usersdto usersdto =authenticationService.authenticatedUser();

        if (animal.getCliente().stream().anyMatch(cliente -> cliente.getId() == usersdto.getCliente().getId())) {
            convertToEntityVoid(animalDto, animal);
            animal.setImagem(imagemString);
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
    public Page<ConsultaSimpleDto> findAllConsultaByAnimal(Pageable pages, long id){
        boolean flag = false;
        if (id == 0) {
            List<Animal> animalList = usersService.findUsers().getCliente().getAnimal();
            for (Animal animal : animalList){
                if (animal.getId() == id) {
                    flag = true;
                }
            }
            if (!flag) {
                throw new DataIntegrityViolationException("Você não têm permissão para acessar esse animal");
            }

            existsById(id);
        }

        Page<Consulta> consulta = animalRepository.findAllConsultaByAnimalId(id, pages);

        return consulta.map(consultas -> convertToDto(consultas, ConsultaSimpleDto.class));
    }

    @Transactional
    public void deleteImagem(String filename){
        fileStorageService.deleteFile(filename);
    }


    @Transactional
    public void existsById(Long id){
        if (!animalRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }
}




