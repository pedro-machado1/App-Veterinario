package com.controller;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.enums.Estado;
import com.model.Consultorio;
import com.model.Users;
import com.service.ConsultorioService;
import com.service.UsersService;
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
@RequestMapping("api/consultorio")
public class ConsultorioController {
    @Autowired
    private ConsultorioService consultorioService;

    @Autowired
    private UsersService usersService;

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
    public ResponseEntity<Optional<ConsultorioSimpleDto>> findById(@PathVariable Long id){
        Optional<Consultorio> consultorio =consultorioService.findById(id);
        if (consultorio.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Optional.of(convertToDto(consultorio.get(), ConsultorioSimpleDto.class)));
    }

    @GetMapping()
    public ResponseEntity<Page<ConsultorioDto>> findAll(Pageable pages, @RequestParam(required = false) String estado, @RequestParam(required = false) String endereco){
        Page<ConsultorioDto> responsePages;
        if (estado != null ) {
            try {
            Estado estadoConsulta = Estado.valueOf(estado);
            responsePages = consultorioService.findAll(pages, estadoConsulta);
            }catch (Exception e){
                return ResponseEntity.status(400).build();
            }
        }
        else {
            responsePages = consultorioService.findAll(pages, null);
        }
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
    @DeleteMapping("/removeveterinario/{idVeterinario}")
    public ResponseEntity<String> removeVeterinaro(@PathVariable Long idVeterinario) {
        Users users = usersService.findUsers();
        consultorioService.removeVeterinario(users.getId(), idVeterinario);
        return ResponseEntity.ok().body("o consultório foi removido");
    }

    @GetMapping("{id}/veterinario")
    public ResponseEntity<Page<VeterinarioSimpleDto>> findAllVeterinario(@PathVariable Long id, Pageable pages) {
        Page<VeterinarioSimpleDto> veterinario = consultorioService.findAllVeterinario(id, pages);
        return ResponseEntity.ok().body(veterinario);
    }

    @PutMapping("/{id}/addcliente/{idCliente}")
    public ResponseEntity<ConsultorioDto> addCliente(@PathVariable Long id, @PathVariable Long idCliente) {
        ConsultorioDto veterinarioDto = consultorioService.addCliente(id, idCliente);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("/{id}/removecliente/{idCliente}")
    public ResponseEntity<String> removeCliente(@PathVariable Long id, @PathVariable Long idCliente) {
        consultorioService.removeCliente(id, idCliente);
        return ResponseEntity.ok().body("o cliente foi removido");
    }

    @GetMapping("{id}/cliente")
    public ResponseEntity<Page<ClienteSimpleDto>> findAllCliente(@PathVariable Long id, Pageable pages) {
        Page<ClienteSimpleDto> clientesPage = consultorioService.findAllCliente(id, pages);
        return ResponseEntity.ok().body(clientesPage);
    }



}
