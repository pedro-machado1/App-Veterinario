package com.security;

import com.security.dto.AuthenticationDto;
import com.security.dto.RegisterDto;
import com.security.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getLogin(), data.getPassword());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Users) auth.getPrincipal());

        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDto registerDto){
        if(usersRepository.findByLogin(registerDto.getLogin()) != null) return ResponseEntity.badRequest().body("Login já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDto.getPassword());
        Users newUser = new Users(registerDto.getLogin(), encryptedPassword, registerDto.getRole());

        usersRepository.save(newUser);
        return ResponseEntity.ok().build();
    }
}
