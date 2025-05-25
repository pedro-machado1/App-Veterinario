package com.service;

import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.cliente.ClienteUpdateDto;
import com.model.Animal;
import com.model.Cliente;
import com.repository.AnimalRepository;
import com.repository.ClienteRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static com.extras.Converters.*;

// Fazer exception;
@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AnimalService animalService;

    @Transactional
    public ClienteDto insert(ClienteDto clienteDTO){
        Cliente cliente= convertToEntity(clienteDTO, Cliente.class);
        cliente.setDataDeCriacao(LocalDateTime.now());
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
        cliente.setDataDeAlteracao(LocalDateTime.now());
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

    @Transactional
    public ClienteDto addAnimal(Long idCliente, Long idAnimal ) {
        existsById(idCliente);
        AnimalSimpleDto animal = convertToDto(
                animalService.findById(idAnimal)
                        .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class
        );

        ClienteDto clienteDto = convertToDto( clienteRepository.getReferenceById(idCliente), ClienteDto.class);
        if (clienteDto.getAnimal() == null) {
            clienteDto.setAnimal(new ArrayList<>());
        }
        if (clienteDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Cliente já está cadastrado no Animal");
        }
        clienteDto.getAnimal().add(animal);
        Cliente clienteentity = convertToEntity(clienteDto, Cliente.class);

        clienteentity = clienteRepository.save(clienteentity);

        return convertToDto(clienteentity, ClienteDto.class);
    }
    @Transactional
    public void removeAnimal(Long idCliente, Long idAnimal) {
        existsById(idCliente);
        AnimalSimpleDto animal = convertToDto(
                animalService.findById(idAnimal)
                        .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class
        );
        ClienteDto clienteDto = convertToDto( clienteRepository.getReferenceById(idCliente), ClienteDto.class);
        if (clienteDto.getAnimal() == null) {
            throw new DataBaseException("Animal não possui clientes cadastrados");
        }
        if (!clienteDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Cliente não está cadastrado no animal");
        }
        clienteDto.getAnimal().remove(animal);
        Cliente clienteentity = convertToEntity(clienteDto, Cliente.class);
        clienteRepository.save(clienteentity);

    }
    @Transactional
    public Page<AnimalSimpleDto> findAllAnimal(long idCliente, Pageable pages){
        existsById(idCliente);

        Page<Animal> animal = clienteRepository.findAllClienteByVeterinario(idCliente, pages);

        return animal.map(animais -> convertToDto(animais, AnimalSimpleDto.class));
    }


}
