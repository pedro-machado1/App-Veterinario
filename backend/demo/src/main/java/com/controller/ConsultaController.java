package com.controller;

import com.dto.consulta.ConsultaDto;
import com.dto.consulta.ConsultaUpdateDto;
import com.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.lang.module.ResolutionException;
import java.net.URI;
import java.util.Optional;

import static com.extras.Converters.convertToDto;
import static com.extras.Converters.convertToEntity;
import static org.springframework.web.servlet.function.ServerResponse.created;

@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/consulta")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;
    @PostMapping()
    public ResponseEntity<ConsultaDto> insert(@Validated @RequestBody ConsultaDto consultaDto) {
        ConsultaDto consulta = consultaService.insert(consultaDto);
        URI uri = ServletUriComponentsBuilder
                  .fromCurrentRequest()
                  .path("/{id}")
                  .buildAndExpand(consulta.getId())
                  .toUri();
        return ResponseEntity.created(uri).body(consulta);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<ConsultaDto>> findById(@PathVariable Long id){
        Optional<ConsultaDto> consultaDto =consultaService.findById(id);
        return ResponseEntity.ok(consultaDto);
    }

    @GetMapping()
    public ResponseEntity<Page<ConsultaDto>> findAll(Pageable pages){
        Page<ConsultaDto> responsePages = consultaService.findAll(pages);
        return ResponseEntity.ok(responsePages);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaDto> update(@PathVariable Long id, @Validated @RequestBody ConsultaUpdateDto consultaDto){
        ConsultaDto consulta = consultaService.update(id, consultaDto);
        return ResponseEntity.ok(consulta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        consultaService.delete(id);
        return ResponseEntity.ok().body("o consulta " + id + " foi removido");
    }
}
