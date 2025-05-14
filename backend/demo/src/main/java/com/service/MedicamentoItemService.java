package com.service;

import com.dto.consulta.ConsultaSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.dto.medicamentoItemdto.MedicamentoItemDto;
import com.dto.medicamentoItemdto.MedicamentoItemUpdateDto;
import com.model.Consulta;
import com.model.Medicamento;
import com.model.MedicamentoItem;
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

    public MedicamentoItemDto insert(MedicamentoItemDto medicamentoItemDto) {
        Consulta consultaEntity = consultaRepository.findById(medicamentoItemDto.getConsulta().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Consulta Not Found"));

        Medicamento medicamentoEntity = medicamentoRepository.findById(medicamentoItemDto.getMedicamento().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento Not Found"));

        MedicamentoItem medicamentoItem = new MedicamentoItem();
        medicamentoItem.setNome(medicamentoItemDto.getNome());
        medicamentoItem.setDescricao(medicamentoItemDto.getDescricao());
        medicamentoItem.setQuantidade(medicamentoItemDto.getQuantidade());
        medicamentoItem.setConsulta(consultaEntity);
        medicamentoItem.setMedicamento(medicamentoEntity);

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
        
        Optional<Medicamento> medicamento = medicamentoRepository.findById(medicamentoItemDto.getMedicamento().getId());
        if (medicamento.isEmpty()) {throw new ResourceNotFoundException("Medicamento Not Found");}
        MedicamentoSimpleDto medicamentoSimpleDto = convertToDto(medicamento, MedicamentoSimpleDto.class);
        medicamentoItemDto.setMedicamento(medicamentoSimpleDto);

        Optional<Consulta> consulta = consultaRepository.findById(medicamentoItemDto.getConsulta().getId());
        if (consulta.isEmpty()) {throw new ResourceNotFoundException("Consulta Not Found");}
        ConsultaSimpleDto consultaSimpleDto = convertToDto(consulta, ConsultaSimpleDto.class);
        medicamentoItemDto.setConsulta(consultaSimpleDto);
        
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
        if(!medicamentoRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }
}
