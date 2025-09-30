package com.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.dto.veterinario.VeterinarioUpdateDto;
import com.extras.EmailToVeterinario;
import com.model.Animal;
import com.model.Users;
import com.model.Veterinario;
import com.security.dto.AuthenticationDto;
import com.security.service.AuthenticationService;
import com.security.service.TokenService;
import com.service.ConsultorioService;
import com.service.UsersService;
import com.service.VeterinarioService;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static com.extras.Converters.convertToDto;


@Validated
@RestController
@RequestMapping("api/veterinario")
public class VeterinarioController {

    @Autowired
    private VeterinarioService veterinarioService;

    @Autowired
    private ConsultorioService consultorioService;

    @Autowired
    private EmailToVeterinario emailToVeterinario;

    @Autowired
    private UsersService usersService;

    @Autowired
    private TokenService tokenService;

    @PostMapping()
    public ResponseEntity<VeterinarioDto> insert(
            @Validated @RequestPart("veterinario") VeterinarioDto veterinariodto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem,
             @RequestParam String token){
        VeterinarioDto veterinario = veterinarioService.insert(veterinariodto,imagem);
        tokenService.validateTokenForVeterinario(token);
        DecodedJWT jwt  =JWT.decode(token);
        String consultorioId  =jwt.getClaim("consultorioId").toString();
        consultorioService.addVeterinarioWithConsultorioId(veterinario.getId(),  Long.parseLong(consultorioId));
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(veterinario.getId())
                .toUri();
        return ResponseEntity.created(uri).body(veterinario);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthenticationDto veterinariodto){
        Users users = usersService.findUsers();
        long consultorioId = users.getConsultorio().getId();
        String token =tokenService.generateTokenForVeterinario(veterinariodto.getEmail(), consultorioId);
        emailToVeterinario.sendEmail(veterinariodto.getEmail(), token);
        return ResponseEntity.ok().body("O e-mail foi enviado");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<VeterinarioSimpleDto>> findById(@PathVariable Long id){
        Optional<Veterinario> veterinarioDto = veterinarioService.findById(id);
        if (veterinarioDto.isEmpty()) throw  new ResourceNotFoundException("Veterinario não encontrado");
        return ResponseEntity.ok(Optional.of(convertToDto(veterinarioDto.get(), VeterinarioSimpleDto.class)));
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<Resource> findImagemById(@PathVariable Long id){
        Optional<Veterinario> veterinarioOptional = veterinarioService.findById(id);

        if (veterinarioOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try{
            Veterinario veterinario = veterinarioOptional.get();
            Resource resource = veterinarioService.findImagemByVeterinario(veterinario);

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
        veterinarioService.deleteImagem();
        return ResponseEntity.ok().body("imagem removida");
    }

    @GetMapping()
    public ResponseEntity<Page<VeterinarioDto>> findAll(Pageable pages,
                                                        @RequestParam(required = false) String crvm
    ){
        Page<VeterinarioDto> responsePages;
         responsePages =veterinarioService.findAll(pages, crvm);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping()
    public ResponseEntity<VeterinarioDto> update(
            @Validated @RequestPart("veterinario") VeterinarioUpdateDto veterinarioUpdateDto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ){
        VeterinarioDto veterinarioDto = veterinarioService.update(veterinarioUpdateDto, imagem);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        veterinarioService.delete(id);
        return ResponseEntity.ok().body("o veterinario " + id + " foi removido");
    }


    @GetMapping("/consulta")
    public ResponseEntity<Page<ConsultaSimpleDto>> findAllConsulta(Pageable pages) {
        Page<ConsultaSimpleDto> consultaPage = veterinarioService.findAllConsultaByVeterinario(pages, 0);
        return ResponseEntity.ok().body(consultaPage);
    }


}


