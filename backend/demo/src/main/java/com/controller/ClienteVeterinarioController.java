package com.controller;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.service.ClienteVeterinarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/clienteVeterinario")
public class ClienteVeterinarioController {

    @Autowired
    private ClienteVeterinarioService clienteVeterinarioService;

    @PostMapping
    public ResponseEntity<Void> vincular(@RequestParam Long clienteId, @RequestParam Long veterinarioId) {
        clienteVeterinarioService.vincular(clienteId, veterinarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> desvincular(@RequestParam Long clienteId, @RequestParam Long veterinarioId) {
        clienteVeterinarioService.desvincular(clienteId, veterinarioId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<VeterinarioSimpleDto>> listarVeterinariosDoCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(clienteVeterinarioService.listarVeterinariosDoCliente(clienteId));
    }

    @GetMapping("/veterinario/{veterinarioId}")
    public ResponseEntity<List<ClienteSimpleDto>> listarClientesDoVeterinario(@PathVariable Long veterinarioId) {
        return ResponseEntity.ok(clienteVeterinarioService.listarClientesDoVeterinario(veterinarioId));
    }
}