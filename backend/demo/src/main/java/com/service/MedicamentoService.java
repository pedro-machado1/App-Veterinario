package com.service;

import com.dto.medicamento.MedicamentoDto;
import com.dto.medicamento.MedicamentoUpdateDto;
import com.model.Medicamento;
import com.repository.MedicamentoRepository;
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
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Transactional
    public MedicamentoDto insert(MedicamentoDto medicamentoDto){
        Medicamento medicamento = convertToEntity(medicamentoDto, Medicamento.class);
        medicamento = medicamentoRepository.save(medicamento);
        return convertToDto(medicamento, MedicamentoDto.class);
    }

    @Transactional(readOnly = true)
    public Optional<MedicamentoDto> findById(Long id){
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));;
        return Optional.of(convertToDto(medicamento, MedicamentoDto.class));
    }

    @Transactional
    public Page<MedicamentoDto> findAll(Pageable pages){
        Page<Medicamento> medicamentos = medicamentoRepository.findAll(pages);
        return medicamentos.map(medicamento -> convertToDto(medicamento, MedicamentoDto.class));
    }

    @Transactional
    public MedicamentoDto update(Long id, MedicamentoUpdateDto medicamentoDto){
        existsById(id);
        Medicamento medicamento = medicamentoRepository.getReferenceById(id);
        convertToEntityVoid(medicamentoDto, medicamento);
        medicamento = medicamentoRepository.save(medicamento);
        return convertToDto(medicamento, MedicamentoDto.class);
    }

    @Transactional
    public void delete(Long id){
        existsById(id);
        try {
            medicamentoRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este cliente devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o cliente");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!medicamentoRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

}
