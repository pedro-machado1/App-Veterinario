package com.service;

import com.dto.cep.CepResponseDto;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class CepService {

    private static final String VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    private final RestTemplate restTemplate;
    

    public CepResponseDto buscarCep(String cep) {
        String cepFormatado = cep.replaceAll("[^0-9]", "");
        if (cepFormatado.length() != 8) {
            throw new IllegalArgumentException("CEP deve conter 8 dígitos");
        }

        String url = VIACEP_URL.replace("{cep}", cepFormatado);
        CepResponseDto response = restTemplate.getForObject(url, CepResponseDto.class);

        if (response != null && Boolean.TRUE.equals(response.getErro())) {
            throw new RuntimeException("CEP não encontrado");
        }

        return response;
    }
}
