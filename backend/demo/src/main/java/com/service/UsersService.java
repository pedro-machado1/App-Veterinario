package com.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dto.users.Usersdto;
import com.dto.cliente.ClienteDto;
import com.model.Users;
import com.security.UsersRepository;
import com.service.exceptions.DataBaseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Transactional
    public Users findById(Long id) throws DataBaseException {
        Optional<Users> user = usersRepository.findById(id);
        if(user.isEmpty())throw new DataBaseException("User not found");
        return user.get();
    }

    @Transactional
    public Users findUsers(String token) throws DataBaseException {
        DecodedJWT jwt = JWT.decode(token);
        long id = Long.parseLong(jwt.getSubject());
        Optional<Users> user = usersRepository.findById(id);
        if(user.isEmpty())throw new DataBaseException("User not found");
        return user.get();
    }

    @Transactional
    public void addCliente(ClienteDto clienteDto) throws DataBaseException {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        com.model.Users currentUser = (com.model.Users) principal;
        long userId = currentUser.getId();
        Optional<Users> usuario = usersRepository.findById(userId);
        if(usuario.isEmpty())throw new DataBaseException("User not found");
        Users user = usuario.get();
        Usersdto usersdto = convertToDto(user, Usersdto.class);
        usersdto.setCliente(clienteDto);
        convertToEntityVoid(usersdto, user);
        usersRepository.save(user);
    }

    @Transactional
    public void deleteCliente(String token) throws DataBaseException {

    }
}
