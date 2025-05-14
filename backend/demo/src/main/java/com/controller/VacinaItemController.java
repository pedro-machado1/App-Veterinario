package com.controller;

import com.dto.vacinaItemdto.VacinaItemDto;
import com.dto.vacinaItemdto.VacinaItemUpdateDto;
import com.service.VacinaItemService;
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
@RequestMapping("/api/vacinaItem")
public class VacinaItemController {
    @Autowired
    private VacinaItemService vacinaItemService;

    @PostMapping()
    public ResponseEntity<VacinaItemDto> insert(@Validated @RequestBody VacinaItemDto vacinaItemDto){
        VacinaItemDto vacinaItem = vacinaItemService.insert(vacinaItemDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(vacinaItem.getId())
                .toUri();
        return ResponseEntity.created(uri).body(vacinaItem);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<VacinaItemDto>> findById(@PathVariable Long id){
        Optional<VacinaItemDto> vacinaItemDto = vacinaItemService.findById(id);
        return ResponseEntity.ok(vacinaItemDto);
    }

    @GetMapping()
    public ResponseEntity<Page<VacinaItemDto>> findAll(Pageable pages){
        Page<VacinaItemDto> responsePages =vacinaItemService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacinaItemDto> update(@PathVariable Long id, @Validated @RequestBody VacinaItemUpdateDto vacinaItemDto){
        VacinaItemDto vacinaItem = vacinaItemService.update(id, vacinaItemDto);
        return ResponseEntity.ok(vacinaItem);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        vacinaItemService.delete(id);
        return ResponseEntity.ok().body("o vacinaItem " + id + " foi removido");
    }
}
