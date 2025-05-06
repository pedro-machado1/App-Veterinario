package com.service;

import com.dto.cliente.ClienteDto;
import com.model.Cliente;
import com.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.extras.Converters.convertToDto;
import static com.extras.Converters.convertToEntity;


@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;


    @Transactional
    public ClienteDto insert(ClienteDto clienteDTO){
        Cliente cliente= convertToEntity(clienteDTO, Cliente.class);
        cliente = clienteRepository.save(cliente);
        return convertToDto(cliente, ClienteDto.class);
    }

}
