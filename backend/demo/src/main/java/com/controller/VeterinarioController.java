package com.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.dto.veterinario.VeterinarioUpdateDto;
import com.extras.EmailToVeterinario;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

import static com.extras.Converters.convertToDto;

// criar endpoint que processa adiciona veterinarios para um certo escritorio e os envia um email;

@Validated
@RestController
@CrossOrigin( origins = "http://localhost:8080")
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
    public ResponseEntity<VeterinarioDto> insert( @RequestBody VeterinarioDto veterinariodto, @RequestParam String token){
        VeterinarioDto veterinario = veterinarioService.insert(veterinariodto);
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

    @GetMapping()
    public ResponseEntity<Page<VeterinarioDto>> findAll(Pageable pages){
        Page<VeterinarioDto> responsePages =veterinarioService.findAll(pages);
        return ResponseEntity.ok().body(responsePages);
    }
    @PutMapping()
    public ResponseEntity<VeterinarioDto> update(@Validated @RequestBody VeterinarioUpdateDto veterinarioUpdateDto){
        VeterinarioDto veterinarioDto = veterinarioService.update(veterinarioUpdateDto);
        return ResponseEntity.ok(veterinarioDto);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        veterinarioService.delete(id);
        return ResponseEntity.ok().body("o veterinario " + id + " foi removido");
    }

}


