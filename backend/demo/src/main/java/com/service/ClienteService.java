package com.service;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteUpdateDto;
import com.model.Cliente;
import com.repository.ClienteRepository;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static com.extras.Converters.*;


@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;


    @Transactional
    public ClienteDto insert(ClienteDto clienteDTO){
        Cliente cliente= convertToEntity(clienteDTO, Cliente.class);
        cliente.setDataDeCriacao(LocalDate.now());
        cliente = clienteRepository.save(cliente);
        return convertToDto(cliente, ClienteDto.class);
    }
    @Transactional(readOnly = true)
    public Optional<ClienteDto> findById(Long id){
        Cliente cliente = clienteRepository.findById(id)
                          .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
                          return Optional.of(convertToDto(cliente, ClienteDto.class));
    }

    // findAll

    // fazer exceptions;

    // id ta criando outro usuario

    @Transactional
    public ClienteDto update(Long id, ClienteUpdateDto clienteDto){
        Cliente cliente = clienteRepository.getReferenceById(id);
        cliente.setDataDeAlteracao(LocalDate.now());
        convertToEntityVoid(clienteDto, cliente);
        cliente = clienteRepository.save(cliente);
        return convertToDto(cliente, ClienteDto.class);
    }

    // remove

}
