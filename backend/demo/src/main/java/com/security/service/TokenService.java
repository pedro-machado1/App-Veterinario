package com.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.refresh}")
    private String refreshToken;

    @Value("${api.security.token.access}")
    private String accessToken;

    @Value("${api.security.token.reset}")
    private String resetTokenSecret;

    @Value("${api.security.token.secret}")
    private String secretLoginVeterinario;

    public String generateRefreshToken(long id){
        long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 30; // 30 dias
        try{
            Algorithm algorithm = Algorithm.HMAC256(refreshToken);
            return JWT.create()
                    .withSubject(String.valueOf(id))
                    .withIssuer("API Veterinario")
                    .withIssuedAt(new Date(System.currentTimeMillis()))
                    .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                    .sign(algorithm);
        }catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public DecodedJWT validateRefreshToken(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC256(refreshToken);
        return JWT.require(algorithm)
                .withIssuer("API Veterinario")
                .build()
                .verify(token);
    }

    public String generateAccessToken(long id){
        long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 minutos
        try{
            Algorithm algorithm = Algorithm.HMAC256(accessToken);
            return JWT.create()
                    .withSubject(String.valueOf(id))
                    .withIssuer("API Veterinario")
                    .withIssuedAt(new Date(System.currentTimeMillis()))
                    .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                    .sign(algorithm);
        }catch (JWTCreationException e){
            throw new RuntimeException("Erro ao gerar token JWT", e);
        }
    }

    public DecodedJWT validateAccessToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(accessToken);
        return JWT.require(algorithm)
                .withIssuer("API Veterinario")
                .build()
                .verify(token);}

    public String generateResetPasswordToken(long id) {
        long RESET_TOKEN_EXPIRATION = 1000 * 60 * 20; // 20 minutos
        try {
            Algorithm algorithm = Algorithm.HMAC256(resetTokenSecret);
            return JWT.create()
                    .withSubject(String.valueOf(id))
                    .withIssuer("API Veterinario")
                    .withIssuedAt(new Date(System.currentTimeMillis()))
                    .withExpiresAt(new Date(System.currentTimeMillis() + RESET_TOKEN_EXPIRATION))
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token JWT de reset de senha", e);
        }
    }

    public DecodedJWT validateResetPasswordToken(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC256(resetTokenSecret);
        return JWT.require(algorithm)
                .withIssuer("API Veterinario")
                .build()
                .verify(token);
    }

    public String generateTokenForVeterinario(String email) {
        long TOKEN_VETERINARIO = 1000 * 60 * 60; // 60 minutos
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretLoginVeterinario);
            return JWT.create()
                    .withSubject(email)
                    .withIssuer("API Veterinario")
                    .withIssuedAt(new Date(System.currentTimeMillis()))
                    .withExpiresAt(new Date(System.currentTimeMillis() + TOKEN_VETERINARIO))
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token JWT de reset de senha", e);
        }
    }

    public DecodedJWT validateTokenForVeterinario(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC256(secretLoginVeterinario);
        return JWT.require(algorithm)
                .withIssuer("API Veterinario")
                .build()
                .verify(token);
    }

    public String getSubjectFromToken(String token) {
        return JWT.decode(token).getSubject();
    }
}
