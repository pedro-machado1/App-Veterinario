package com.service;

import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Consultorio;
import com.model.Users;
import com.model.Veterinario;
import com.repository.ConsultorioRepository;
import com.repository.VeterinarioRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.extras.Converters.*;
import static com.extras.Converters.convertToDto;


@Service
public class ConsultorioService {

    @Autowired
    private ConsultorioRepository consultorioRepository;

    @Autowired
    private VeterinarioService veterinarioService;

    @Autowired
    private UsersService usersService;

    @Transactional
    public ConsultorioDto insert(ConsultorioDto consultorioDto) {
        Consultorio consultorio= convertToEntity(consultorioDto, Consultorio.class);
        consultorio.setDataDeCadastro(LocalDate.now());
        consultorio = consultorioRepository.save(consultorio);
        consultorioDto = convertToDto(consultorio, ConsultorioDto.class);
        usersService.addConsultorio(consultorioDto);
        return consultorioDto;
    }

    @Transactional(readOnly = true)
    public Optional<ConsultorioDto> findById(Long id){
        Consultorio consultorio = consultorioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(consultorio, ConsultorioDto.class));
    }

    @Transactional
    public Page<ConsultorioDto> findAll(Pageable pages){
        Page<Consultorio> consultorios = consultorioRepository.findAll(pages);
        return consultorios.map(consultorio -> convertToDto(consultorio, ConsultorioDto.class));
    }


    @Transactional
    public ConsultorioDto update(ConsultorioUpdateDto consultorioDto){
        Users users = usersService.findUsers();
        long id = users.getConsultorio().getId();
        existsById(id);
        Consultorio consultorio = consultorioRepository.getReferenceById(id);
        convertToEntityVoid(consultorioDto, consultorio);
        consultorio = consultorioRepository.save(consultorio);
        return convertToDto(consultorio, ConsultorioDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            consultorioRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este consultorio devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o consultorio");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!consultorioRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

    @Transactional
    public ConsultorioDto addVeterinario(Long idVeterinario) {
        Users users = usersService.findUsers();
        long idConsultorio = users.getConsultorio().getId();
        existsById(idConsultorio);
        VeterinarioSimpleDto veterinario = convertToDto(
                veterinarioService.findById(idVeterinario)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), VeterinarioSimpleDto.class
        );

        ConsultorioDto consultorioDto = convertToDto( consultorioRepository.getReferenceById(idConsultorio), ConsultorioDto.class);
        if (consultorioDto.getVeterinario() == null) {
            consultorioDto.setVeterinario(new ArrayList<>());
        }
        if (consultorioDto.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Consultório já está cadastrado no veterinário");
        }
        consultorioDto.getVeterinario().add(veterinario);
        Consultorio consultorioentity = convertToEntity(consultorioDto, Consultorio.class);
         consultorioentity = consultorioRepository.save(consultorioentity);

        return convertToDto(consultorioentity, ConsultorioDto.class);
    }
    @Transactional
    public void addVeterinarioWithConsultorioId(Long idVeterinario, long idConsultorio) {
        existsById(idConsultorio);
        VeterinarioSimpleDto veterinario = convertToDto(
                veterinarioService.findById(idVeterinario)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), VeterinarioSimpleDto.class
        );

        ConsultorioDto consultorioDto = convertToDto( consultorioRepository.getReferenceById(idConsultorio), ConsultorioDto.class);
        if (consultorioDto.getVeterinario() == null) {
            consultorioDto.setVeterinario(new ArrayList<>());
        }
        if (consultorioDto.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Consultório já está cadastrado no veterinário");
        }
        consultorioDto.getVeterinario().add(veterinario);
        Consultorio consultorioentity = convertToEntity(consultorioDto, Consultorio.class);
        consultorioentity = consultorioRepository.save(consultorioentity);

    }
    @Transactional
    public void removeVeterinario( Long idConsultorio, Long idVeterinario) {
        existsById(idVeterinario);
        VeterinarioSimpleDto veterinario = convertToDto(
                veterinarioService.findById(idVeterinario)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio)), VeterinarioSimpleDto.class
        );
        ConsultorioDto consultorioDto = convertToDto(consultorioRepository.getReferenceById(idVeterinario), ConsultorioDto.class);
        if (consultorioDto.getVeterinario() == null) {
            throw new DataBaseException("Veterinário não possui consultórios cadastrados");
        }
        if (!consultorioDto.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Consultório não está cadastrado no veterinário");
        }
        consultorioDto.getVeterinario().remove(veterinario);
        Consultorio consultorioentity = convertToEntity(consultorioDto, Consultorio.class);
        consultorioRepository.save(consultorioentity);

    }
    @Transactional
    public Page<VeterinarioSimpleDto> findAllVeterinario(long idConsultorio, Pageable pages){
        existsById(idConsultorio);

        Page<Veterinario> veterinario = consultorioRepository.findAllVeterinarioByConsultorioId(idConsultorio, pages);

        return veterinario.map(veterinarios -> convertToDto(veterinarios, VeterinarioSimpleDto.class));
    }

}
