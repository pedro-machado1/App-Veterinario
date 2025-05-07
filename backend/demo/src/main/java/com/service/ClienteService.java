package com.service;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteUpdateDto;
import com.model.Cliente;
import com.repository.ClienteRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static com.extras.Converters.*;

// Fazer exception;
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

    @Transactional
    public Page<ClienteDto> findAll(Pageable pages){
        Page<Cliente> clientes = clienteRepository.findAll(pages);
        return clientes.map(cliente -> convertToDto(cliente, ClienteDto.class));
    }


    @Transactional
    public ClienteDto update(Long id, ClienteUpdateDto clienteDto){
        existsById(id);
        Cliente cliente = clienteRepository.getReferenceById(id);
        cliente.setDataDeAlteracao(LocalDate.now());
        convertToEntityVoid(clienteDto, cliente);
        cliente = clienteRepository.save(cliente);
        return convertToDto(cliente, ClienteDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            clienteRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este cliente devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o cliente");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!clienteRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

}
