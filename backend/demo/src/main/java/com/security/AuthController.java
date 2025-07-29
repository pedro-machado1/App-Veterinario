package com.security;

import com.model.Users;
import com.security.dto.AuthenticationDto;
import com.security.dto.RegisterDto;
import com.security.service.AuthenticationService;
import com.security.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDto data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var token = tokenService.generateToken((Users) auth.getPrincipal());
            return ResponseEntity.ok(token);
        }catch (AuthenticationCredentialsNotFoundException e){
            throw new AuthenticationCredentialsNotFoundException("Email ou senha inválidos");
        }

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email){
        authenticationService.requestNewPassword(email);
        return ResponseEntity.ok("Email enviado com sucesso. Verifique sua caixa de entrada para recuperar a senha.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody String password){
        authenticationService.resetPassword(token, password);
        return ResponseEntity.ok("Senha alterada com sucesso.");

    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDto registerDto){
        if(usersRepository.findByEmail(registerDto.getEmail()) != null) return ResponseEntity.badRequest().body("Email já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDto.getPassword());
        Users newUser = new Users(registerDto.getEmail(), encryptedPassword, registerDto.getRole());

        usersRepository.save(newUser);
        return ResponseEntity.ok().build();
    }
}
