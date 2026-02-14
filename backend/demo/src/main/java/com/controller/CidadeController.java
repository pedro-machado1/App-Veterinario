package com.controller;

import com.dto.cidade.CidadeSimpleDto;
import com.service.CidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cidades")
public class CidadeController {

    @Autowired
    private CidadeService cidadeService;


    @GetMapping("/uf/{ufId}")
    public ResponseEntity<List<CidadeSimpleDto>> listarPorUfId(@PathVariable Integer ufId) {

        List<CidadeSimpleDto> cidades = cidadeService.listarCidadesPorUfId(ufId);

        return ResponseEntity.ok(cidades);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CidadeSimpleDto>> buscar(@RequestParam String nome) {
        List<CidadeSimpleDto> cidades = cidadeService.buscarCidadesPorNome(nome);
        return ResponseEntity.ok(cidades);
    }

}
