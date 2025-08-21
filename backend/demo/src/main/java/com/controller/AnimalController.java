package com.controller;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalUpdateDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;


@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/animal")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping()
    public ResponseEntity<AnimalDto> insert(@Validated @RequestBody AnimalDto animal) {
        AnimalDto newAnimalDto = animalService.insert(animal);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newAnimalDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newAnimalDto);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<AnimalDto>> findById(@PathVariable Long id){
        Optional<AnimalDto> animalDto =animalService.findById(id);
        return ResponseEntity.ok(animalDto);
    }

    @GetMapping()
    public ResponseEntity<Page<AnimalDto>> findAll(Pageable pages){
        Page<AnimalDto> responsePages =animalService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping("{id}")
    public ResponseEntity<AnimalDto> update(@PathVariable Long id, @Validated @RequestBody AnimalUpdateDto animalUpdateDto){
        AnimalDto animalDto = animalService.update(id, animalUpdateDto);
        return ResponseEntity.ok(animalDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        animalService.delete(id);
        return ResponseEntity.ok().body("o animal " + id + " foi removido");
    }
}

