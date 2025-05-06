package com.controller;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.cliente.ClienteUpdateDto;
import com.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.Optional;

@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clientService;
    @Autowired
    private ClienteService clienteService;

    @PostMapping("/post")
    public ResponseEntity<ClienteDto> insert(@Validated @RequestBody ClienteDto cliente) {
        ClienteDto newClientDto = clientService.insert(cliente);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newClientDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newClientDto);
    }
    @GetMapping("/post/{id}")
    public ResponseEntity<Optional<ClienteDto>> findById(@PathVariable Long id){
        Optional<ClienteDto> clienteDto =clientService.findById(id);
        return ResponseEntity.ok(clienteDto);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ClienteDto> update(@PathVariable Long id, @Validated @RequestBody ClienteUpdateDto clienteUpdateDto){
       ClienteDto clienteDto = clientService.update(id, clienteUpdateDto);
       return ResponseEntity.ok(clienteDto);
    }


}
