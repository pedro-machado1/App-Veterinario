package com.controller;

import com.dto.observacao.ObservacaoDto;
import com.dto.observacao.ObservacaoSimpleDto;
import com.dto.observacao.ObservacaoUpdateDto;
import com.model.Observacao;
import com.service.ObservacaoService;
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
@RequestMapping("api/observacao")
public class ObservacaoController {
    @Autowired
    private ObservacaoService observacaoService;

    @PostMapping()
    public ResponseEntity<ObservacaoDto> insert(@Validated @RequestBody ObservacaoDto observacao) {
        ObservacaoDto newClientDto = observacaoService.insert(observacao);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newClientDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newClientDto);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<ObservacaoSimpleDto>> findById(@PathVariable Long id){
        Optional<Observacao> observacao =observacaoService.findById(id);
        if (observacao.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Optional.of(convertToDto(observacao.get(), ObservacaoSimpleDto.class )));
    }

    // look into changing page size and changing to PageModel;

    @GetMapping()
    public ResponseEntity<Page<ObservacaoDto>> findAll(Pageable pages){
        Page<ObservacaoDto> responsePages =observacaoService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping("{id}")
    public ResponseEntity<ObservacaoDto> update(@PathVariable Long id, @Validated @RequestBody ObservacaoUpdateDto observacaoUpdateDto){
        ObservacaoDto observacaoDto = observacaoService.update(id, observacaoUpdateDto);
        return ResponseEntity.ok(observacaoDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        observacaoService.delete(id);
        return ResponseEntity.ok().body("o observacao " + id + " foi removido");
    }

}
