package com.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.model.Users;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private Instant lastPasswordChange;

    public String generateToken(Users user){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("API Veterinario")
                    .withSubject(user.getEmail())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
            return token;
        }catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }catch (TokenExpiredException exception){
            throw new RuntimeException("Token expirado", exception);
        }
    }

    public String validateToken(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
             return JWT.require(algorithm)
                    .withIssuer("API Veterinario")
                    .build()
                     .verify(token)
                     .getSubject();

        }catch (JWTVerificationException exception){
            throw new RuntimeException("Token JWT inválido", exception);
        }
    }

    public String generateTokenWithEmail(String email){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("API Veterinario")
                    .withSubject(email)
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
            return token;
        }catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }catch (TokenExpiredException exception){
            throw new RuntimeException("Token expirado", exception);
        }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now(ZoneOffset.UTC).plusHours(2).toInstant(ZoneOffset.UTC);
    }

    public String getSubjectFromToken(String token) {
        return JWT.decode(token).getSubject();
    }
}
