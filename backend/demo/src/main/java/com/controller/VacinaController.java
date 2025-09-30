package com.controller;

import com.dto.vacina.VacinaDto;
import com.dto.vacina.VacinaSimpleDto;
import com.dto.vacina.VacinaUpdateDto;
import com.model.Vacina;
import com.service.VacinaService;
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
@RequestMapping("api/vacina")
public class VacinaController {

    @Autowired
    private VacinaService vacinaService;

    @PostMapping
    public ResponseEntity<VacinaDto> insert(@Validated @RequestBody VacinaDto vacinaDto){
        VacinaDto vacina = vacinaService.insert(vacinaDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(vacina.getId())
                .toUri();
        return ResponseEntity.created(uri).body(vacina);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<VacinaSimpleDto>> findById(@PathVariable Long id){
        Optional<Vacina> vacina = vacinaService.findById(id);
        if (vacina.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Optional.of(convertToDto(vacina.get(), VacinaSimpleDto.class)));
    }
    @GetMapping()
    public ResponseEntity<Page<VacinaDto>> findAll(Pageable pages){
        Page<VacinaDto> responsePages =vacinaService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacinaDto> update(@PathVariable Long id, @Validated @RequestBody VacinaUpdateDto vacinaDto){
        VacinaDto vacina = vacinaService.update(id, vacinaDto);
        return ResponseEntity.ok(vacina);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        vacinaService.delete(id);
        return ResponseEntity.ok().body("o vacina " + id + " foi removido");
    }
}
