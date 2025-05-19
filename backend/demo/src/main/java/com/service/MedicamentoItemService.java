package com.service;

import com.dto.medicamentoItem.MedicamentoItemDto;
import com.dto.medicamentoItem.MedicamentoItemUpdateDto;
import com.model.Animal;
import com.model.Consulta;
import com.model.Medicamento;
import com.model.MedicamentoItem;
import com.repository.AnimalRepository;
import com.repository.ConsultaRepository;
import com.repository.MedicamentoItemRepository;
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
public class MedicamentoItemService {

    @Autowired
    private MedicamentoItemRepository medicamentoItemRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private AnimalRepository animalRepository;

    public MedicamentoItemDto insert(MedicamentoItemDto medicamentoItemDto) {
        Consulta consultaEntity = consultaRepository.findById(medicamentoItemDto.getConsulta().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Consulta Not Found"));

        Medicamento medicamentoEntity = medicamentoRepository.findById(medicamentoItemDto.getMedicamento().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento Not Found"));

        Animal animal = animalRepository.findById(medicamentoItemDto.getAnimal().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal Not Found"));

        MedicamentoItem medicamentoItem =convertToEntity(medicamentoItemDto, MedicamentoItem.class);
        medicamentoItem.setConsulta(consultaEntity);
        medicamentoItem.setMedicamento(medicamentoEntity);
        medicamentoItem.setAnimal(animal);

        medicamentoItemRepository.save(medicamentoItem);
        return convertToDto(medicamentoItem, MedicamentoItemDto.class);

    }
    // fazer outro exception
    @Transactional
    public Optional<MedicamentoItemDto> findById(Long id) {
        MedicamentoItem medicamento = medicamentoItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(convertToDto(medicamento, MedicamentoItemDto.class));
    }
    public Page<MedicamentoItemDto> findAll(Pageable pageable) {
        Page<MedicamentoItem> pages =medicamentoItemRepository.findAll(pageable);
        return pages.map(medicamentoItem -> convertToDto(medicamentoItem, MedicamentoItemDto.class));
    }
    @Transactional
    public MedicamentoItemDto update(Long id, MedicamentoItemUpdateDto medicamentoItemDto) {
        existsById(id);
        MedicamentoItem medicamentoItem = medicamentoItemRepository.getReferenceById(id);

        Medicamento medicamento = medicamentoRepository.findById(medicamentoItemDto.getMedicamento().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento Not Found"));
        medicamentoItem.setMedicamento(medicamento);

        Consulta consulta = consultaRepository.findById(medicamentoItemDto.getConsulta().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Consulta Not Found"));
        medicamentoItem.setConsulta(consulta);

        convertToEntityVoid(medicamentoItemDto, medicamentoItem);
        medicamentoItemRepository.save(medicamentoItem);
        return convertToDto(medicamentoItem, MedicamentoItemDto.class);
    }
    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            medicamentoItemRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este medicamento devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o medicamento");
        }
    }
    @Transactional
    public void existsById(Long id){
        if(!medicamentoItemRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }
}
