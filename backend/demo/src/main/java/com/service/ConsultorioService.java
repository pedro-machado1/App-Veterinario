package com.service;

import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Consultorio;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.extras.Converters.*;
import static com.extras.Converters.convertToDto;


// fazer API pra add and remove

@Service
public class ConsultorioService {

    @Autowired
    private ConsultorioRepository consultorioRepository;

    @Autowired
    private VeterinarioService veterinarioService;

    @Transactional
    public ConsultorioDto insert(ConsultorioDto consultorioDto) {
        Consultorio consultorio= convertToEntity(consultorioDto, Consultorio.class);
        insertOrupdateVeterinario(consultorioDto.getVeterinario(), consultorio);
        consultorio.setDatadeCadastro(LocalDateTime.now());
        consultorio = consultorioRepository.save(consultorio);
        return convertToEntity(consultorio, ConsultorioDto.class);
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
    public ConsultorioDto update(Long id, ConsultorioUpdateDto consultorioDto){
        existsById(id);
        Consultorio consultorio = consultorioRepository.getReferenceById(id);
        insertOrupdateVeterinario(consultorioDto.getVeterinario(), consultorio);
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


    private void insertOrupdateVeterinario(List<VeterinarioSimpleDto> veterinarioDto, Consultorio consultorio){
        if (Objects.isNull(veterinarioDto)){
            return;
        }
        if (Objects.nonNull(consultorio) && Objects.nonNull(consultorio.getVeterinario())){
            consultorio.getVeterinario().clear();
        }
        veterinarioDto.forEach(veterinariodto -> {
            Veterinario veterinarioEntity = convertToEntity(veterinarioService.findById(veterinariodto.getId()), Veterinario.class);
            consultorio.getVeterinario().add(veterinarioEntity);
        });
    }
}
