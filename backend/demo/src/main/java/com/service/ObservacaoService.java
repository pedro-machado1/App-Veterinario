package com.service;

import com.dto.animal.AnimalSimpleDto;
import com.dto.observacao.ObservacaoDto;
import com.dto.observacao.ObservacaoUpdateDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.model.Observacao;
import com.repository.ObservacaoRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.extras.Converters.*;
import static com.extras.Converters.convertToDto;

@Service
public class ObservacaoService {

    @Autowired
    private ObservacaoRepository observacaoRepository;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private VeterinarioService veterinarioService;

    @Transactional
    public ObservacaoDto insert(ObservacaoDto observacaoDTO){
        AnimalSimpleDto animal = convertToDto(animalService.findById(observacaoDTO.getAnimal().getId())
                        .orElseThrow( () -> new ResourceNotFoundException("id do animal não encontrado" + observacaoDTO.getAnimal().getId())),
                    AnimalSimpleDto.class);
        VeterinarioSimpleDto veterinario = convertToDto(veterinarioService.findById(observacaoDTO.getVeterinario().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Veterinário não encontrado")),
                    VeterinarioSimpleDto.class);

        observacaoDTO.setVeterinario(veterinario);
        observacaoDTO.setAnimal(animal);
        Observacao observacao= convertToEntity(observacaoDTO, Observacao.class);
        observacao = observacaoRepository.save(observacao);
        return convertToDto(observacao, ObservacaoDto.class);
    }
    @Transactional(readOnly = true)
    public Optional<ObservacaoDto> findById(Long id){
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(observacao, ObservacaoDto.class));
    }

    @Transactional
    public Page<ObservacaoDto> findAll(Pageable pages){
        Page<Observacao> observacoes = observacaoRepository.findAll(pages);
        return observacoes.map(observacao -> convertToDto(observacao, ObservacaoDto.class));
    }


    @Transactional
    public ObservacaoDto update(Long id, ObservacaoUpdateDto observacaoDto){
        existsById(id);

        AnimalSimpleDto animal = convertToDto(animalService.findById(observacaoDto.getAnimal().getId())
                        .orElseThrow( () -> new ResourceNotFoundException("id do animal não encontrado" + observacaoDto.getAnimal().getId())),
                    AnimalSimpleDto.class);
        VeterinarioSimpleDto veterinario = convertToDto(veterinarioService.findById(observacaoDto.getVeterinario().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Veterinário não encontrado")),
                    VeterinarioSimpleDto.class);

        observacaoDto.setAnimal(animal);
        observacaoDto.setVeterinario(veterinario);
        Observacao observacao = observacaoRepository.getReferenceById(id);
        convertToEntityVoid(observacaoDto, observacao);
        observacao = observacaoRepository.save(observacao);
        return convertToDto(observacao, ObservacaoDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            observacaoRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este observacao devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o observacao");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!observacaoRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

}
