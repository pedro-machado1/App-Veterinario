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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.extras.Converters.*;

@Service
public class VacinaItemService {

    @Autowired
    private VacinaItemRepository vacinaItemRepository;

    @Autowired
    private VacinaRepository vacinaRepository;

    @Transactional
    public VacinaItemDto insert(VacinaItemDto vacinaItemDto){
        VacinaItemDto vacinaItemAux = convertToDto(vacinaItemDto, VacinaItemDto.class);

        Vacina vacina = vacinaRepository.findById(vacinaItemDto.getVacina().getId())
                .orElseThrow(() -> new IllegalArgumentException("Id não encontrado: " + vacinaItemDto.getVacina().getId()));
        VacinaSimpleDto vacinasimples = convertToDto(vacina ,VacinaSimpleDto.class);

        vacinaItemAux.setVacina(vacinasimples);
        VacinaItem vacinaItem = convertToEntity(vacinaItemDto, VacinaItem.class);
        vacinaItemRepository.save(vacinaItem);
        return convertToDto(vacinaItem, VacinaItemDto.class);

    }
    @Transactional
    public Optional<VacinaItemDto> findById(Long id){
        VacinaItem vacinaItem = vacinaItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(vacinaItem, VacinaItemDto.class));
    }

    @Transactional
    public Page<VacinaItemDto> findAll(Pageable pages){
        Page<VacinaItem> page =vacinaItemRepository.findAll(pages);
        return page.map(vacinaItem -> convertToDto(vacinaItem, VacinaItemDto.class));
    }

    @Transactional
    public VacinaItemDto update(Long id, VacinaItemUpdateDto vacinaItemDto){
        existsById(id);
        VacinaItem vacinaItem = vacinaItemRepository.getReferenceById(id);

        Vacina vacina = vacinaRepository.findById(vacinaItemDto.getVacina().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacina Not Found"));
        vacinaItem.setVacina(vacina);

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
