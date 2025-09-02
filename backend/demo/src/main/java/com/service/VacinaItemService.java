package com.service;

import com.dto.vacina.VacinaSimpleDto;
import com.dto.vacinaItem.VacinaItemDto;
import com.dto.vacinaItem.VacinaItemUpdateDto;
import com.model.Vacina;
import com.model.VacinaItem;
import com.repository.VacinaItemRepository;
import com.repository.VacinaRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class VacinaItemService {

    @Autowired
    private VacinaItemRepository vacinaItemRepository;

    @Autowired
    private VacinaService vacinaService;

    @Transactional
    public VacinaItemDto insert(VacinaItemDto vacinaItemDto){

        VacinaSimpleDto vacina = convertToDto( vacinaService.findById(vacinaItemDto.getVacina().getId())
                .orElseThrow(() -> new IllegalArgumentException("Id não encontrado: " + vacinaItemDto.getVacina().getId()))
                ,VacinaSimpleDto.class);
        vacinaItemDto.setVacina(vacina);
        vacinaItemDto.setDataAplicacao(LocalDateTime.now());
        VacinaItem vacinaItem = convertToEntity(vacinaItemDto, VacinaItem.class);
        vacinaItem =vacinaItemRepository.save(vacinaItem);
        return convertToDto(vacinaItem, VacinaItemDto.class);

    }
    @Transactional
    public Optional<VacinaItem> findById(Long id){
        VacinaItem vacinaItem = vacinaItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(vacinaItem);
    }

    @Transactional
    public Page<VacinaItemDto> findAll(Pageable pages){
        Page<VacinaItem> page =vacinaItemRepository.findAll(pages);
        return page.map(vacinaItem -> convertToDto(vacinaItem, VacinaItemDto.class));
    }

    @Transactional
    public VacinaItemDto update(Long id, VacinaItemUpdateDto vacinaItemDto){
        existsById(id);

        VacinaSimpleDto vacina = convertToDto( vacinaService.findById(vacinaItemDto.getVacina().getId())
                .orElseThrow(() -> new IllegalArgumentException("Id não encontrado: " + vacinaItemDto.getVacina().getId())), VacinaSimpleDto.class);
        vacinaItemDto.setVacina(vacina);

        VacinaItem vacinaItem = vacinaItemRepository.getReferenceById(id);
        convertToEntityVoid(vacinaItemDto, vacinaItem);
        vacinaItemRepository.save(vacinaItem);
        return convertToDto(vacinaItem, VacinaItemDto.class);
    }

    @Transactional
    public void delete(Long id){
        existsById(id);
        try {
            vacinaItemRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir esta vacinaItem devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o vacinaItem");
        }
    }


    @Transactional
    public void existsById(Long id){
            if(!vacinaItemRepository.existsById(id)){
                throw new ResourceNotFoundException("Id não encontrado: " + id);
            }
    }
}
