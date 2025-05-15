package com.controller;

import com.dto.medicamento.MedicamentoDto;
import com.dto.medicamento.MedicamentoUpdateDto;
import com.service.MedicamentoService;
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
@RequestMapping("api/medicamento")
public class MedicamentoController {
    @Autowired
    private MedicamentoService medicamentoService;

    @PostMapping()
    public ResponseEntity<MedicamentoDto> insert(@Validated @RequestBody MedicamentoDto medicamentoDto){
        MedicamentoDto medicamento = medicamentoService.insert(medicamentoDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(medicamento.getId())
                .toUri();
        return ResponseEntity.created(uri).body(medicamento);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<MedicamentoDto>> findById(@PathVariable Long id){
        Optional<MedicamentoDto> medicamentoDto = medicamentoService.findById(id);
        return ResponseEntity.ok(medicamentoDto);
    }

    @GetMapping()
    public ResponseEntity<Page<MedicamentoDto>> findAll(Pageable pages){
        Page<MedicamentoDto> responsePages =medicamentoService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoDto> update(@PathVariable Long id, @Validated @RequestBody MedicamentoUpdateDto medicamentoDto){
        MedicamentoDto medicamento = medicamentoService.update(id, medicamentoDto);
        return ResponseEntity.ok(medicamento);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        medicamentoService.delete(id);
        return ResponseEntity.ok().body("o medicamento " + id + " foi removido");
    }

}
