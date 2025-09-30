package com.controller;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalSimpleDto;
import com.dto.animal.AnimalUpdateDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.model.Animal;
import com.service.AnimalService;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static com.extras.Converters.convertToEntity;


@Validated
@RestController
@RequestMapping("api/animal")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping()
    public ResponseEntity<AnimalDto> insert(
            @Validated @RequestPart("animal") AnimalDto animal,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) {
        AnimalDto newAnimalDto = animalService.insert(animal, imagem);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newAnimalDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newAnimalDto);
    }

    @GetMapping("{id}")
    public ResponseEntity<AnimalSimpleDto> findById(@PathVariable Long id){
        Optional<Animal> animal = animalService.findByIdwithAuthenticate(id, 0);
        if (animal.isEmpty()) return ResponseEntity.notFound().build();
        Animal animalentety = animal.get();

        return ResponseEntity.ok(convertToEntity(animalentety, AnimalSimpleDto.class));
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<Resource> findImagemById(@PathVariable Long id){
        Optional<Animal> animalOptional = animalService.findByIdwithAuthenticate(id, 0);

        if (animalOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try{
        Animal animal = animalOptional.get();
        Resource resource = animalService.findImagemByAnimal(animal);

            Path filePath = ((UrlResource) resource).getFile().toPath();

            String contentType = Files.probeContentType(filePath);
            if(contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
        }catch (Exception e) {
        return ResponseEntity.notFound().build();
        }
    }

//    só vai poder deletar a sua própria imagem
    @DeleteMapping("/{id}/imagem")
    public ResponseEntity<String> deleteImagemById(@PathVariable Long id){
        Optional<Animal> optionalAnimal = animalService.findByIdwithAuthenticate(id, 0);
        if (optionalAnimal.isEmpty()) throw new DataIntegrityViolationException("não foi possível encontrar o animal");
        Animal animal = optionalAnimal.get();
        animalService.deleteImagem(animalService.findImagemByAnimal(animal).getFilename());
        return ResponseEntity.ok().body("imagem do animal foi removida");
    }

    @GetMapping("/{id}/cliente")
    public ResponseEntity<AnimalSimpleDto> findAnimalById(@PathVariable Long id, @RequestParam(required = true) long idCliente){

        Optional<Animal> animal = animalService.findByIdwithAuthenticate(id, idCliente);

        if (animal.isEmpty()) return ResponseEntity.notFound().build();
        Animal animalentety = animal.get();
        return ResponseEntity.ok(convertToEntity(animalentety, AnimalSimpleDto.class));
    }


    @GetMapping("/{id}/consulta")
    public ResponseEntity<Page<ConsultaSimpleDto>> findAllConsulta(Pageable pages, @PathVariable long id) {
        Page<ConsultaSimpleDto> consultaPage = animalService.findAllConsultaByAnimal(pages, id);
        return ResponseEntity.ok().body(consultaPage);
    }

    @GetMapping()
    public ResponseEntity<Page<AnimalDto>> findAll(Pageable pages){
        Page<AnimalDto> responsePages =animalService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping("{id}")
    public ResponseEntity<AnimalDto> update(
            @PathVariable Long id,
            @Validated @RequestPart("animal") AnimalUpdateDto animalUpdateDto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ){
        AnimalDto animalDto = animalService.update(id, animalUpdateDto, imagem);
        if (animalDto == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(animalDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        animalService.delete(id);
        return ResponseEntity.ok().body("o animal " + id + " foi removido");
    }
}

