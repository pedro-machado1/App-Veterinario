package com.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dto.animal.AnimalDto;
import com.dto.animal.AnimalSimpleDto;
import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.cliente.ClienteUpdateDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.users.Usersdto;
import com.model.Animal;
import com.model.Cliente;
import com.model.Consulta;
import com.model.Users;
import com.repository.AnimalRepository;
import com.repository.ClienteRepository;
import com.security.UsersRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private UsersService usersService;


    @Transactional
    public ClienteDto insert(ClienteDto clienteDTO){
        Cliente cliente= convertToEntity(clienteDTO, Cliente.class);
        cliente.setDataDeCriacao(LocalDate.now());
        cliente = clienteRepository.save(cliente);
        clienteDTO = convertToDto(cliente, ClienteDto.class);
        usersService.addCliente(clienteDTO);
        return clienteDTO ;
    }

    @Transactional(readOnly = true)
    public Optional<Cliente> findById(Long id){
        Cliente cliente = clienteRepository.findById(id)
                          .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(cliente);
    }

    @Transactional
    public Page<ClienteDto> findAll(Pageable pages, String cpf){
        Page<Cliente> clientes;
        if (cpf != null){
            clientes = clienteRepository.findAllByCpf(cpf, pages);
        }
        else {
            clientes = clienteRepository.findAll(pages);
        }
        return clientes.map(cliente -> convertToDto(cliente, ClienteDto.class));
    }

    @Transactional
    public ClienteDto update(ClienteUpdateDto clienteDto) {
            Users user  =usersService.findUsers();
            long id = user.getCliente().getId();
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

    @Transactional
    public ClienteDto addAnimal(Long idAnimal ) {
        long idCliente =findClienteId();
        existsById(idCliente);
        AnimalSimpleDto animal = convertToDto(
                animalService.findById(idAnimal)
                        .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class
        );

        ClienteUpdateDto clienteDto = convertToDto( clienteRepository.getReferenceById(idCliente), ClienteUpdateDto.class);
        if (clienteDto.getAnimal() == null) {
            clienteDto.setAnimal(new ArrayList<>());
        }
        if (clienteDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Cliente já está cadastrado no Animal");
        }
        clienteDto.getAnimal().add(animal);
        Cliente clienteentity = convertToEntity(clienteDto, Cliente.class);
        clienteentity.setId(idCliente);

        clienteentity = clienteRepository.save(clienteentity);

        return convertToDto(clienteentity, ClienteDto.class);
    }
    @Transactional
    public void removeAnimal(Long idAnimal) {
        long idCliente =findClienteId();
        existsById(idCliente);
        AnimalSimpleDto animal = convertToDto(
                animalService.findById(idAnimal)
                        .orElseThrow(() -> new ResourceNotFoundException("Animal não encontrado com ID: " + idAnimal)), AnimalSimpleDto.class
        );
        ClienteUpdateDto clienteDto = convertToDto( clienteRepository.getReferenceById(idCliente), ClienteUpdateDto.class);
        if (clienteDto.getAnimal() == null) {
            throw new DataBaseException("Cliente não possui cadastrados");
        }
        if (!clienteDto.getAnimal().contains(animal)) {
            throw new DataBaseException("Cliente não está cadastrado no animal");
        }
        clienteDto.getAnimal().remove(animal);
        Cliente clienteentity = convertToEntity(clienteDto, Cliente.class);
        clienteRepository.save(clienteentity);

    }
    @Transactional
    public Page<AnimalSimpleDto> findAllAnimal(Pageable pages, long idCliente){
        if (idCliente == 0) idCliente = findClienteId();
        existsById(idCliente);

        Page<Animal> animal = clienteRepository.findAllAnimalByCliente(idCliente, pages);

        return animal.map(animais -> convertToDto(animais, AnimalSimpleDto.class));
    }

    @Transactional
    public long findClienteId(){
        Users user  =usersService.findUsers();
        return user.getCliente().getId();
    }

    @Transactional
    public Page<ConsultaSimpleDto> findAllConsultaByCliente(Pageable pages, long id){
        if (id == 0) {
            id = findClienteId();
            existsById(id);
        }

        Page<Consulta> consulta = clienteRepository.findAllConsultaByCliente(id, pages);

        return consulta.map(consultas -> convertToDto(consultas, ConsultaSimpleDto.class));
    }


}
