package com.service;

import com.service.exceptions.ResourceNotFoundException;
import com.dto.cidade.CidadeSimpleDto;
import com.model.Cidade;
import com.repository.CidadeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.extras.Converters.convertToEntity;

@Service
public class CidadeService {

    @Autowired
    private CidadeRepository cidadeRepository;

    public List<CidadeSimpleDto> listarCidadesPorUfId(Integer ufId) {

        if (ufId == null) {
            throw new IllegalArgumentException("UF ID não pode ser nulo");
        }

        return cidadeRepository
                .findAllByEstado_CodigoUfOrderByNomeAsc(ufId)
                .stream()
                .map(cidade -> convertToEntity(cidade, CidadeSimpleDto.class))
                .toList();
    }

    public List<CidadeSimpleDto> buscarCidadesPorNome(String nome) {
        return cidadeRepository.findAllByNomeContainingIgnoreCaseOrderByNomeAsc(nome)
                .stream()
                .map(cidade -> convertToEntity(cidade, CidadeSimpleDto.class))
                .toList();
    }
}
