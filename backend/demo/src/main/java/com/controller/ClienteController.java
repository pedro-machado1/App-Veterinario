package com.controller;

import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.cliente.ClienteUpdateDto;
import com.model.Cliente;
import com.service.ClienteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.extras.Converters.convertToDto;

@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clientService;


    @PostMapping
    public ResponseEntity<ClienteDto> insert(@Valid @RequestBody ClienteDto cliente, HttpServletRequest request) throws Exception {
        ClienteDto newClientDto = clientService.insert(cliente);
        return ResponseEntity.ok(newClientDto);
    }

    // fzr verification adm pra conferir se tem permisão
    @GetMapping("{id}")
    public ResponseEntity<Optional<ClienteSimpleDto>> findById(@PathVariable Long id) throws Exception {
        Optional<Cliente> clienteDto =clientService.findById(id);
        if (clienteDto.isEmpty()) throw new Exception("error ");
        return ResponseEntity.ok(Optional.of(convertToDto(clienteDto.get(), ClienteSimpleDto.class)));
    }

    // look into changing page size and changing to PageModel;

    @GetMapping()
    public ResponseEntity<Page<ClienteDto>> findAll(Pageable pages, @RequestParam(required = false) String cpf){
         Page<ClienteDto> responsePages =clientService.findAll(pages, cpf);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping()
    public ResponseEntity<ClienteDto> update(@Validated @RequestBody ClienteUpdateDto clienteUpdateDto){
       ClienteDto clienteDto = clientService.update(clienteUpdateDto);
       return ResponseEntity.ok(clienteDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        clientService.delete(id);
        return ResponseEntity.ok().body("o cliente " + id + " foi removido");
    }
    @PutMapping("/addanimal/{idAnimal}")
    public ResponseEntity<ClienteDto> addAnimal(@PathVariable Long idAnimal) {
        ClienteDto clienteDto = clientService.addAnimal(idAnimal);
        return ResponseEntity.ok(clienteDto);
    }
    @DeleteMapping("/removeanimal/{idAnimal}")
    public ResponseEntity<String> removeAnimal(@PathVariable Long idAnimal) {
        clientService.removeAnimal(idAnimal);
        return ResponseEntity.ok().body("o animal foi removido");
    }

    @GetMapping("/animal")
    public ResponseEntity<Page<AnimalSimpleDto>> findAllAnimal(Pageable pages) {
        Page<AnimalSimpleDto> animalPage = clientService.findAllAnimal(pages);
        return ResponseEntity.ok().body(animalPage);
    }


}
