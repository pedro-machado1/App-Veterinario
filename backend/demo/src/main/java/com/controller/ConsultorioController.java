package com.controller;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Consultorio;
import com.model.Users;
import com.service.ConsultorioService;
import com.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static com.extras.Converters.convertToDto;


// separar api de add cliente
@Validated
@RestController
@RequestMapping("api/consultorio")
public class ConsultorioController {
    @Autowired
    private ConsultorioService consultorioService;

    @Autowired
    private UsersService usersService;

    @PostMapping()
    public ResponseEntity<ConsultorioDto> insert(
            @Validated @RequestPart("consultorio") ConsultorioDto consultorioDto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) {
        return ResponseEntity.ok().body(consultorioService.insert(consultorioDto, imagem));
    }
    @GetMapping("{id}")
    public ResponseEntity<Optional<ConsultorioSimpleDto>> findById(@PathVariable Long id){
        Optional<Consultorio> consultorio =consultorioService.findById(id);
        if (consultorio.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Optional.of(convertToDto(consultorio.get(), ConsultorioSimpleDto.class)));
    }

    @GetMapping()
    public ResponseEntity<Page<ConsultorioDto>> findAll(
            Pageable pages,
            @RequestParam(required = false) Integer estadoCodigo,
            @RequestParam(required = false) Long cidade_id,
            @RequestParam(required = false) String endereco){
        Page<ConsultorioDto> responsePages;
        try {
            responsePages = consultorioService.findAllByFilters(estadoCodigo, cidade_id, pages);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok().body(responsePages);
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<Resource> findImagemById(@PathVariable Long id){
        Optional<Consultorio> consultorioOptional = consultorioService.findById(id);

        if (consultorioOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try{
            Consultorio consultorio = consultorioOptional.get();
            Resource resource = consultorioService.findImagemByConsultorio(consultorio);

            Path filePath = ((UrlResource) resource).getFile().toPath();

            String contentType = Files.probeContentType(filePath);
            if(contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/imagem")
    public ResponseEntity<String> deleteImagem(){
        consultorioService.deleteImagem();
        return ResponseEntity.ok().body("imagem removida");
    }

    @PutMapping()
    public ResponseEntity<ConsultorioDto> update(
            @Validated @RequestPart("consultorio") ConsultorioUpdateDto consultorioUpdateDto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ){
        ConsultorioDto consultorioDto = consultorioService.update(consultorioUpdateDto, imagem);
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
        consultorioService.removeVeterinario(users.getConsultorio().getId(), idVeterinario);
        return ResponseEntity.ok().body("o consultório foi removido");
    }

    @GetMapping("{id}/veterinario")
    public ResponseEntity<Page<VeterinarioSimpleDto>> findAllVeterinario(@PathVariable Long id,
                                                                         Pageable pages
    ) {
        Page<VeterinarioSimpleDto> veterinario = consultorioService.findAllVeterinario(id, pages);
        return ResponseEntity.ok().body(veterinario);
    }

    @PutMapping("/{id}/addcliente/{idCliente}")
    public ResponseEntity<ConsultorioDto> addCliente(@PathVariable Long id, @PathVariable Long idCliente) {
        ConsultorioDto veterinarioDto = consultorioService.addCliente(id, idCliente);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("/removecliente/{idCliente}")
    public ResponseEntity<String> removeCliente(@PathVariable Long idCliente) {
        consultorioService.removeCliente(idCliente);
        return ResponseEntity.ok().body("o cliente foi removido");
    }

    @GetMapping("{id}/cliente")
    public ResponseEntity<Page<ClienteSimpleDto>> findAllCliente(
            @PathVariable Long id, 
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) Long cidade_id,
            Pageable pages) {
        Page<ClienteSimpleDto> clientesPage = consultorioService.findAllClienteByFilters(id, cpf, cidade_id, pages);
        return ResponseEntity.ok().body(clientesPage);
    }



}
