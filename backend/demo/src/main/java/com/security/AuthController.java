package com.security;

import com.dto.users.Usersdto;
import com.model.Users;
import com.security.dto.AuthenticationDto;
import com.security.dto.Newpassword;
import com.security.service.AuthenticationService;
import com.security.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.extras.Converters.convertToDto;


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

    @Autowired
    private UsersRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid AuthenticationDto data, HttpServletResponse response) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            Users users = (Users) auth.getPrincipal();

            var refreshToken = tokenService.generateRefreshToken(users.getId());
            var accessToken = tokenService.generateAccessToken(users.getId());

            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(false);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(60 * 60 * 24 * 30);
            response.addCookie(refreshTokenCookie);

            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(false);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(60* 15);
            response.addCookie(accessTokenCookie);

            return ResponseEntity.ok().build();
        } catch (AuthenticationCredentialsNotFoundException e) {
            throw new AuthenticationCredentialsNotFoundException("Email ou senha inválidos");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody AuthenticationDto dto){
        authenticationService.requestNewPassword(dto.getEmail());
        return ResponseEntity.ok("Email enviado com sucesso. Verifique sua caixa de entrada para recuperar a senha.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody Newpassword password){
        authenticationService.resetPassword(token, password.getPassword());
        return ResponseEntity.ok("Senha alterada com sucesso.");

    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid AuthenticationDto registerDto, HttpServletResponse response){
        if(usersRepository.findByEmail(registerDto.getEmail()) != null) return ResponseEntity.badRequest().body("Email já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDto.getPassword());
        Users newUser = new Users(registerDto.getEmail(), encryptedPassword, Role.CLIENTE);

        usersRepository.save(newUser);
        login(registerDto, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/registerConsultorio")
    public ResponseEntity<String> registerConsultorio(@RequestBody @Valid AuthenticationDto registerDto, HttpServletResponse response){
        if(usersRepository.findByEmail(registerDto.getEmail()) != null) return ResponseEntity.badRequest().body("Email já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDto.getPassword());
        Users newUser = new Users(registerDto.getEmail(), encryptedPassword, Role.CONSULTORIO);

        usersRepository.save(newUser);
        login(registerDto, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/registerVeterinario")
    public ResponseEntity<String> registerVeterinario(@RequestBody @Valid AuthenticationDto registerDto, HttpServletResponse response){
        if(usersRepository.findByEmail(registerDto.getEmail()) != null) return ResponseEntity.badRequest().body("Email já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDto.getPassword());
        Users newUser = new Users(registerDto.getEmail(), encryptedPassword, Role.VETERINARIO);

        usersRepository.save(newUser);
        login(registerDto, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/authentication")
    public ResponseEntity<Usersdto> authentication(){
        try {
            Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
            Users currentUser = (Users) principal;
            currentUser = userRepository.findByEmail(currentUser.getEmail());
            Usersdto usersdto=convertToDto(currentUser, Usersdto.class);
            usersdto.setPassword(null);
            return ResponseEntity.ok().body(usersdto);

        }catch (Exception e){
            return ResponseEntity.status(403).build();

        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response){
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);

        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        response.addCookie(accessTokenCookie);

        return ResponseEntity.ok().build();
    }



}
