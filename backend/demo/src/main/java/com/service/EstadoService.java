package com.service;

import com.repository.CidadeRepository;
import com.dto.cidade.CidadeSimpleDto;
import com.repository.EstadoRepository;
import com.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoService {

    private final EstadoRepository estadoRepository;
    private final CidadeRepository cidadeRepository;

    @Transactional(readOnly = true)
    public List<CidadeSimpleDto> listarCidadesPorUf(String uf) {
        String ufNorm = normalizarUf(uf);

        estadoRepository.findByUfIgnoreCase(ufNorm)
                .orElseThrow(() -> new ResourceNotFoundException("UF não encontrada: " + ufNorm));

        return cidadeRepository.findAllByEstado_UfIgnoreCaseOrderByNomeAsc(ufNorm)
                .stream()
                .map(c -> {
                    CidadeSimpleDto dto = new CidadeSimpleDto();
                    dto.setIdIbge(c.getIdIbge());
                    dto.setNome(c.getNome());
                    dto.setUf(c.getUf());
                    return dto;
                })
                .toList();
    }

    private String normalizarUf(String uf) {
        String ufNorm = (uf == null) ? "" : uf.trim();
        if (ufNorm.length() != 2) {
            throw new IllegalArgumentException("UF deve conter 2 caracteres");
        }
        return ufNorm;
    }
}