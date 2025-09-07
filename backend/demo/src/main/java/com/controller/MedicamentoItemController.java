package com.controller;

import com.dto.medicamentoItem.MedicamentoItemDto;
import com.dto.medicamentoItem.MedicamentoItemSimpleDto;
import com.dto.medicamentoItem.MedicamentoItemUpdateDto;
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

import static com.extras.Converters.convertToDto;

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
    public ResponseEntity<Optional<MedicamentoItemSimpleDto>> findById(@PathVariable Long id) {
        Optional<MedicamentoItem> medicamentoItem = medicamentoItemService.findById(id);
        if (medicamentoItem.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Optional.of(convertToDto(medicamentoItem.get(), MedicamentoItemSimpleDto.class)));
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
