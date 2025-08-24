package com.service;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteUpdateDto;
import com.model.Cliente;
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
    public Users findUsers() throws DataBaseException {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        Users currentUser = (Users) principal;
        long userId = currentUser.getId();
        Optional<Users> usuario = usersRepository.findById(userId);
        if(usuario.isEmpty())throw new DataBaseException("User not found");
        return usuario.get();
    }

    @Transactional
    public void addCliente(ClienteDto clienteDto) throws DataBaseException {
        Users user = findUsers();
        Cliente cliente = convertToEntity(clienteDto, Cliente.class);
        user.setCliente(cliente);
        usersRepository.save(user);
    }

    @Transactional
    public void deleteCliente(String token) throws DataBaseException {

    }
}
