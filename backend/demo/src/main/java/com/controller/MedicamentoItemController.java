package com.controller;

import com.dto.medicamentoItemdto.MedicamentoItemDto;
import com.dto.medicamentoItemdto.MedicamentoItemUpdateDto;
import com.model.MedicamentoItem;
import com.service.MedicamentoItemService;
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
@RequestMapping("/api/medicamentoItem")
public class MedicamentoItemController {
    @Autowired
    private MedicamentoItemService medicamentoItemService;
    @PostMapping()
    public ResponseEntity<MedicamentoItemDto> insert(@Validated @RequestBody MedicamentoItemDto medicamentoDto) {
        MedicamentoItemDto medicamentoItemDto = medicamentoItemService.insert(medicamentoDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(medicamentoItemDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(medicamentoItemDto);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<MedicamentoItemDto>> findById(@PathVariable Long id) {
        Optional<MedicamentoItemDto> medicamentoItemDto = medicamentoItemService.findById(id);
        return ResponseEntity.ok(medicamentoItemDto);
    }
    @GetMapping
    public ResponseEntity<Page<MedicamentoItemDto>> findAll(Pageable page){
        Page<MedicamentoItemDto> pages = medicamentoItemService.findAll(page);
        return ResponseEntity.ok().body(pages);
    }
    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoItemDto> update(@PathVariable Long id, @Validated @RequestBody MedicamentoItemUpdateDto medicamentoDto) {
        MedicamentoItemDto medicamentoItemDto = medicamentoItemService.update(id, medicamentoDto);
        return ResponseEntity.ok(medicamentoItemDto);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        medicamentoItemService.delete(id);
        return ResponseEntity.ok().body("o medicamentoItem " + id + " foi removido");
    }
}
