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
    public ResponseEntity<Void> vincular(@RequestParam Long veterinarioId) {
        clienteVeterinarioService.vincular(veterinarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cliente")
    public ResponseEntity<Void> desvincularCliente(@RequestParam Long veterinarioId) {
        clienteVeterinarioService.clienteDesvincularVeterinario(veterinarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/veterinario")
    public ResponseEntity<Void> desvincularVeterinario(@RequestParam Long clienteId) {
        clienteVeterinarioService.veterinarioDesvincularCliente(clienteId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<VeterinarioSimpleDto>> listarVeterinariosDoCliente() {
        return ResponseEntity.ok(clienteVeterinarioService.listarVeterinariosDoCliente());
    }

        @GetMapping("/veterinario")
        public ResponseEntity<List<ClienteSimpleDto>> listarClientesDoVeterinario() {
            return ResponseEntity.ok(clienteVeterinarioService.listarClientesDoVeterinario());
        }

    @GetMapping("/existe")
    public ResponseEntity<Boolean> existe(@RequestParam Long veterinarioId) {
        if (clienteVeterinarioService.existeVinculoAPI(veterinarioId)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }
}