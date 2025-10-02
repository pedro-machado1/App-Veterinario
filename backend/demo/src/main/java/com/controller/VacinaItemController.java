package com.controller;

import com.dto.vacina.VacinaSimpleDto;
import com.dto.vacinaItem.VacinaItemDto;
import com.dto.vacinaItem.VacinaItemSimpleDto;
import com.dto.vacinaItem.VacinaItemUpdateDto;
import com.model.VacinaItem;
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

import static com.extras.Converters.convertToDto;

@Validated
@RestController
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
    public ResponseEntity<Optional<VacinaItemSimpleDto>> findById(@PathVariable Long id){
        Optional<VacinaItem> vacinaItemDto = vacinaItemService.findById(id);
        return ResponseEntity.ok(Optional.of(convertToDto(vacinaItemDto, VacinaItemSimpleDto.class)));
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
