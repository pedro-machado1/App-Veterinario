package com.controller;

import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.service.ConsultorioService;
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
@RequestMapping("api/consultorio")
public class ConsultorioController {
    @Autowired
    private ConsultorioService consultorioService;

    @PostMapping()
    public ResponseEntity<ConsultorioDto> insert(@Validated @RequestBody ConsultorioDto consultorioDto) {
        ConsultorioDto consultorio =consultorioService.insert(consultorioDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(consultorio.getId())
                .toUri();
        return ResponseEntity.ok().body(consultorio);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<ConsultorioDto>> findById(@PathVariable Long id){
        Optional<ConsultorioDto> consultorioDto =consultorioService.findById(id);
        return ResponseEntity.ok(consultorioDto);
    }

    @GetMapping()
    public ResponseEntity<Page<ConsultorioDto>> findAll(Pageable pages){
        Page<ConsultorioDto> responsePages =consultorioService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping()
    public ResponseEntity<ConsultorioDto> update(@Validated @RequestBody ConsultorioUpdateDto consultorioUpdateDto){
        ConsultorioDto consultorioDto = consultorioService.update(consultorioUpdateDto);
        return ResponseEntity.ok(consultorioDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        consultorioService.delete(id);
        return ResponseEntity.ok().body("o consultorio " + id + " foi removido");
    }
    @PutMapping("/addveterinario/{idVeterinario}")
    public ResponseEntity<ConsultorioDto> addVeterinario( @PathVariable Long idVeterinario) {
        ConsultorioDto consultorioDto = consultorioService.addVeterinario(idVeterinario);
        return ResponseEntity.ok(consultorioDto);
    }
    @DeleteMapping("/{id}/removeveterinario/{idVeterinario}")
    public ResponseEntity<String> removeVeterinaro(@PathVariable Long id, @PathVariable Long idVeterinario) {
        consultorioService.removeVeterinario(id, idVeterinario);
        return ResponseEntity.ok().body("o consultório foi removido");
    }

    @GetMapping("{id}/veterinario")
    public ResponseEntity<Page<VeterinarioSimpleDto>> findAllConsultorio(@PathVariable Long id, Pageable pages) {
        Page<VeterinarioSimpleDto> veterinario = consultorioService.findAllVeterinario(id, pages);
        return ResponseEntity.ok().body(veterinario);
    }


}
