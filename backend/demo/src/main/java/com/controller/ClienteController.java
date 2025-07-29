package com.controller;

import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteUpdateDto;
import com.service.ClienteService;
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
@RequestMapping("api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clientService;

    @PostMapping
    public ResponseEntity<ClienteDto> insert(@Validated @RequestBody ClienteDto cliente) {
        ClienteDto newClientDto = clientService.insert(cliente);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newClientDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newClientDto);
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<ClienteDto>> findById(@PathVariable Long id){
        Optional<ClienteDto> clienteDto =clientService.findById(id);
        return ResponseEntity.ok(clienteDto);
    }

    // look into changing page size and changing to PageModel;

    @GetMapping()
    public ResponseEntity<Page<ClienteDto>> findAll(Pageable pages){
         Page<ClienteDto> responsePages =clientService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping("{id}")
    public ResponseEntity<ClienteDto> update(@PathVariable Long id, @Validated @RequestBody ClienteUpdateDto clienteUpdateDto){
       ClienteDto clienteDto = clientService.update(id, clienteUpdateDto);
       return ResponseEntity.ok(clienteDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        clientService.delete(id);
        return ResponseEntity.ok().body("o cliente " + id + " foi removido");
    }
    @PutMapping("/{id}/addanimal/{idAnimal}")
    public ResponseEntity<ClienteDto> addCliente(@PathVariable Long id, @PathVariable Long idAnimal) {
        ClienteDto clienteDto = clientService.addAnimal(id, idAnimal);
        return ResponseEntity.ok(clienteDto);
    }
    @DeleteMapping("/{id}/removeanimal/{idAnimal}")
    public ResponseEntity<String> removeCliente(@PathVariable Long id, @PathVariable Long idAnimal) {
        clientService.removeAnimal(id, idAnimal);
        return ResponseEntity.ok().body("o animal foi removido");
    }

    @GetMapping("{id}/animal")
    public ResponseEntity<Page<AnimalSimpleDto>> findAllCliente(@PathVariable Long id, Pageable pages) {
        Page<AnimalSimpleDto> animalPage = clientService.findAllAnimal(id, pages);
        return ResponseEntity.ok().body(animalPage);
    }


}
