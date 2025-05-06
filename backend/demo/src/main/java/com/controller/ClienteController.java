package com.controller;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clientService;

    @PostMapping("/post")
    public ResponseEntity<ClienteDto> insert(@RequestBody ClienteDto cliente) {
        ClienteDto newClientDto = clientService.insert(cliente);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newClientDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newClientDto);
    }



}
