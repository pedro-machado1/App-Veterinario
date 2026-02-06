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

    public List<CidadeSimpleDto> listarCidadesPorUf(String uf) {
        String ufNorm = (uf == null) ? "" : uf.trim();
        if (ufNorm.length() != 2) {
            throw new IllegalArgumentException("UF deve conter 2 caracteres");
        }

        return cidadeRepository.findAllByEstado_UfIgnoreCaseOrderByNomeAsc(ufNorm)
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
