package com.controller;

import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.cliente.ClienteUpdateDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.model.Cliente;
import com.model.Consultorio;
import com.service.ClienteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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

@Validated
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clientService;


    @PostMapping
    public ResponseEntity<ClienteDto> insert(
            @Valid @RequestPart("cliente") ClienteDto cliente,
            @RequestParam(required = false, value = "imagem") MultipartFile imagem
            ) throws Exception {
        ClienteDto newClientDto = clientService.insert(cliente, imagem);
        return ResponseEntity.ok(newClientDto);
    }

    // fzr verification adm pra conferir se tem permisão
    @GetMapping("{id}")
    public ResponseEntity<Optional<ClienteSimpleDto>> findById(@PathVariable Long id) throws Exception {
        Optional<Cliente> clienteDto =clientService.findById(id);
        if (clienteDto.isEmpty()) throw new Exception("error ");
        return ResponseEntity.ok(Optional.of(convertToDto(clienteDto.get(), ClienteSimpleDto.class)));
    }


    @GetMapping("/{id}/imagem")
    public ResponseEntity<Resource> findImagemById(@PathVariable Long id){
        Optional<Cliente> clienteOptional = clientService.findById(id);

        if (clienteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try{
            Cliente cliente = clienteOptional.get();
            Resource resource = clientService.findImagemByAnimal(cliente);

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


    // look into changing page size and changing to PageModel;

    @GetMapping()
    public ResponseEntity<Page<ClienteDto>> findAll(Pageable pages, @RequestParam(required = false) String cpf){
         Page<ClienteDto> responsePages =clientService.findAll(pages, cpf);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping()
    public ResponseEntity<ClienteDto> update(
            @Validated @RequestPart(value = "cliente") ClienteUpdateDto clienteUpdateDto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ){
       ClienteDto clienteDto = clientService.update(clienteUpdateDto, imagem);
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
    public ResponseEntity<Page<AnimalSimpleDto>> findAllAnimal(Pageable pages , @RequestParam(required = false) Long idCliente) {
        Page<AnimalSimpleDto> animalPage;
        if (idCliente == null) animalPage = clientService.findAllAnimal(pages, 0);

        else animalPage = clientService.findAllAnimal(pages, idCliente);

        return ResponseEntity.ok().body(animalPage);
    }

    @GetMapping("/consulta")
    public ResponseEntity<Page<ConsultaSimpleDto>> findAllConsulta(Pageable pages) {
        Page<ConsultaSimpleDto> consultaPage = clientService.findAllConsultaByCliente(pages, 0);
        return ResponseEntity.ok().body(consultaPage);
    }


    @GetMapping("/{idCliente}/consulta")
    public ResponseEntity<Page<ConsultaSimpleDto>> findAllConsulta(Pageable pages, @PathVariable Long idCliente) {
        Page<ConsultaSimpleDto> consultaPage = clientService.findAllConsultaByCliente(pages, idCliente);
        return ResponseEntity.ok().body(consultaPage);
    }

}
