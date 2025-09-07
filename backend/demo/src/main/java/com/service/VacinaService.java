package com.service;

import com.dto.vacina.VacinaDto;
import com.dto.vacina.VacinaUpdateDto;
import com.model.Vacina;
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
public class VacinaService {

    @Autowired
    private VacinaRepository vacinaRepository;

    @Transactional
    public VacinaDto insert(VacinaDto vacinaDto){
        Vacina Vacina = convertToEntity(vacinaDto, Vacina.class);
        Vacina = vacinaRepository.save(Vacina);
        return convertToDto(Vacina, VacinaDto.class);
    }

    @Transactional
    public Optional<Vacina> findById(Long id){
        Vacina vacina = vacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encontrado: " + id));
        return Optional.of(vacina);
    }

    @Transactional
    public Page<VacinaDto> findAll(Pageable pages){
        Page<Vacina> vacinas = vacinaRepository.findAll(pages);
        return vacinas.map(vacina -> convertToDto(vacina, VacinaDto.class));
    }

    @Transactional
    public VacinaDto update(Long id, VacinaUpdateDto vacinaDto){
        existByid(id);
        Vacina vacina = vacinaRepository.getReferenceById(id);
        convertToEntityVoid(vacinaDto, vacina);
        vacina = vacinaRepository.save(vacina);
        return convertToDto(vacina, VacinaDto.class);
    }

    @Transactional
    public void delete(Long id){
        existByid(id);
        try {
            vacinaRepository.deleteById(id);
        }catch (DataIntegrityViolationException e){
            throw new DataBaseException("Não foi possível excluir este cliente devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o cliente");
        }
    }

    @Transactional
    public void existByid(Long id){
        if (!vacinaRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }
}
