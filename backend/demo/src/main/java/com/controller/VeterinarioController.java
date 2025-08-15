package com.controller;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioUpdateDto;
import com.service.VeterinarioService;
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
@CrossOrigin( origins = "http://localhost:8080")
@RequestMapping("api/veterinario")
public class VeterinarioController {

    @Autowired
    private VeterinarioService veterinarioService;

    @PostMapping
    public ResponseEntity<VeterinarioDto> insert( @RequestBody VeterinarioDto veterinariodto){
        VeterinarioDto veterinario = veterinarioService.insert(veterinariodto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(veterinario.getId())
                .toUri();
        return ResponseEntity.created(uri).body(veterinario);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<VeterinarioDto>> findById(@PathVariable Long id){
        Optional<VeterinarioDto> veterinarioDto =veterinarioService.findById(id);
        return ResponseEntity.ok(veterinarioDto);
    }

    @GetMapping()
    public ResponseEntity<Page<VeterinarioDto>> findAll(Pageable pages){
        Page<VeterinarioDto> responsePages =veterinarioService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping("{id}")
    public ResponseEntity<VeterinarioDto> update(@PathVariable Long id, @Validated @RequestBody VeterinarioUpdateDto veterinarioUpdateDto){
        VeterinarioDto veterinarioDto = veterinarioService.update(id, veterinarioUpdateDto);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        veterinarioService.delete(id);
        return ResponseEntity.ok().body("o veterinario " + id + " foi removido");
    }
    @PutMapping("/{id}/addcliente/{idCliente}")
    public ResponseEntity<VeterinarioDto> addCliente(@PathVariable Long id, @PathVariable Long idCliente) {
        VeterinarioDto veterinarioDto = veterinarioService.addCliente(id, idCliente);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("/{id}/removecliente/{idCliente}")
    public ResponseEntity<String> removeCliente(@PathVariable Long id, @PathVariable Long idCliente) {
        veterinarioService.removeCliente(id, idCliente);
        return ResponseEntity.ok().body("o cliente foi removido");
    }

    @GetMapping("{id}/cliente")
    public ResponseEntity<Page<ClienteSimpleDto>> findAllCliente(@PathVariable Long id, Pageable pages) {
        Page<ClienteSimpleDto> clientesPage = veterinarioService.findAllCliente(id, pages);
        return ResponseEntity.ok().body(clientesPage);
    }
}


