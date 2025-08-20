package com.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.controller.ClienteController;
import com.model.Users;
import com.security.service.TokenService;
import com.service.UsersService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UsersService usersService;


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String p = request.getServletPath();
        return p.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorizationHeader = getAcessToken(request);

        String userId = null;
        String jwtToken = null;
        DecodedJWT decodedJWT = null;


        if (authorizationHeader != null) {
            jwtToken = getAcessToken(request);
            try {
                decodedJWT = tokenService.validateAccessToken(jwtToken);
                userId = decodedJWT.getSubject();
            } catch (TokenExpiredException e) {
                refresh(request);
                return;
            } catch (JWTVerificationException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token inválido.");
                return;
            }
        }
        else {
            refresh(request);
             return;
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {


            Users userDetails = usersService.findById(Long.parseLong(userId));

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

    public String getAcessToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "accessToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    public String getRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    public ResponseEntity<String> refresh(HttpServletRequest request) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(403).body("Refresh token não encontrado");
        }

        try {
            DecodedJWT decodedJWT = tokenService.validateRefreshToken(refreshToken);
            long userId = Long.parseLong(decodedJWT.getSubject());
            String newAccessToken = tokenService.generateAccessToken(userId);
            return ResponseEntity.ok(newAccessToken);
        } catch (JWTVerificationException e) {
            return ResponseEntity.status(403).body("Refresh token inválido ou expirado");
        }
    }

}
