package com.service;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Cliente;
import com.model.ClienteVeterinario;
import com.model.Veterinario;
import com.repository.ClienteVeterinarioRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.extras.Converters.convertToDto;

@Service
public class ClienteVeterinarioService {

    @Autowired
    private ClienteVeterinarioRepository clienteVeterinarioRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VeterinarioService veterinarioService;

    @Transactional
    public void vincular(Long clienteId, Long veterinarioId) {
        if (clienteVeterinarioRepository.existsByClienteIdAndVeterinarioId(clienteId, veterinarioId)) {
            throw new DataBaseException("Este cliente já está vinculado a este veterinário.");
        }

        Cliente cliente = clienteService.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        Veterinario veterinario = veterinarioService.findById(veterinarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário não encontrado: " + veterinarioId));

        ClienteVeterinario vinculo = new ClienteVeterinario();
        vinculo.setCliente(cliente);
        vinculo.setVeterinario(veterinario);

        clienteVeterinarioRepository.save(vinculo);
    }

    @Transactional
    public void desvincular(Long clienteId, Long veterinarioId) {
        if (!clienteVeterinarioRepository.existsByClienteIdAndVeterinarioId(clienteId, veterinarioId)) {
            throw new ResourceNotFoundException("Vínculo não existe entre cliente " + clienteId + " e veterinário " + veterinarioId);
        }
        clienteVeterinarioRepository.deleteByClienteIdAndVeterinarioId(clienteId, veterinarioId);
    }

    @Transactional(readOnly = true)
    public List<VeterinarioSimpleDto> listarVeterinariosDoCliente(Long clienteId) {
        clienteService.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + clienteId));

        return clienteVeterinarioRepository.findAllByClienteId(clienteId).stream()
                .map(ClienteVeterinario::getVeterinario)
                .map(v -> convertToDto(v, VeterinarioSimpleDto.class))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClienteSimpleDto> listarClientesDoVeterinario(Long veterinarioId) {
        veterinarioService.findById(veterinarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário não encontrado: " + veterinarioId));

        return clienteVeterinarioRepository.findAllByVeterinarioId(veterinarioId).stream()
                .map(ClienteVeterinario::getCliente)
                .map(c -> convertToDto(c, ClienteSimpleDto.class))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean existeVinculo(Long clienteId, Long veterinarioId) {
        return clienteVeterinarioRepository.existsByClienteIdAndVeterinarioId(clienteId, veterinarioId);
    }
}
