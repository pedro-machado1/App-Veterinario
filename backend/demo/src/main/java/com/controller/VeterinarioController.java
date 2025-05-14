package com.controller;

import com.dto.veterinario.VeterinarioDto;
import com.model.Veterinario;
import com.service.VeterinarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Validated
@RestController
@CrossOrigin( origins = "http://localhost:8080")
@RequestMapping("api/veterinario")
public class VeterinarioController {

    @Autowired
    private VeterinarioService veterinarioService;

    @PostMapping
    public ResponseEntity<VeterinarioDto> insert(@Validated @RequestBody VeterinarioDto veterinariodto){
        VeterinarioDto veterinario = veterinarioService.insert(veterinariodto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(veterinario.getId())
                .toUri();
        return ResponseEntity.created(uri).body(veterinario);

    }

}
