package com.service;


import com.dto.consulta.ConsultaDto;
import com.dto.consulta.ConsultaSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.medicamento.MedicamentoSimpleDto;
import com.dto.veterinario.VeterinarioDto;
import com.model.Consulta;
import com.model.Consultorio;
import com.model.Medicamento;
import com.model.Veterinario;
import com.repository.ConsultaRepository;
import com.repository.ConsultorioRepository;
import com.repository.VeterinarioRepository;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

import static com.extras.Converters.convertToDto;
import static com.extras.Converters.convertToEntity;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private ConsultaRepository cosultorioRepository;

    public VeterinarioDto insert(VeterinarioDto veterinarioDto){
        Veterinario veterinario = convertToEntity(veterinarioDto, Veterinario.class);

//        Optional<Consulta> consulta = cosultorioRepository.findById(veterinarioDto.getConsulta().getId());
//        if (consulta.isEmpty()) {throw new ResourceNotFoundException("Consulta Not Found");}
//        ConsultaSimpleDto consultaSimpleDto = convertToDto(consulta, ConsultaSimpleDto.class);
//        veterinarioDto.setConsulta(consultaSimpleDto);


        veterinario = veterinarioRepository.save(veterinario);
        return convertToDto(veterinario, VeterinarioDto.class);

    }
}
