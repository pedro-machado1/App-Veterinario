package com.service;

import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.consultorio.ConsultorioUpdateDto;
import com.dto.veterinario.VeterinarioDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.enums.Estado;
import com.model.*;
import com.repository.ConsultorioRepository;
import com.repository.VeterinarioRepository;
import com.service.exceptions.DataBaseException;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.extras.Converters.*;
import static com.extras.Converters.convertToDto;


@Service
public class ConsultorioService {

    @Autowired
    private ConsultorioRepository consultorioRepository;

    @Autowired
    private  ClienteService clienteService;

    @Autowired
    private VeterinarioService veterinarioService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public ConsultorioDto insert(ConsultorioDto consultorioDto, MultipartFile imagem) {
        String imagemString = fileStorageService.saveFile(imagem);
        Consultorio consultorio= convertToEntity(consultorioDto, Consultorio.class);
        consultorio.setDataDeCadastro(LocalDate.now());
        if (imagemString != null ) consultorio.setImagem(imagemString);
        consultorio = consultorioRepository.save(consultorio);
        consultorioDto = convertToDto(consultorio, ConsultorioDto.class);
        usersService.addConsultorio(consultorioDto);
        return consultorioDto;
    }

    @Transactional(readOnly = true)
    public Optional<Consultorio> findById(Long id){
        Consultorio consultorio = consultorioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não encotrado: " + id));
        return Optional.of(consultorio);
    }

    @Transactional
    public Resource findImagemByConsultorio(Consultorio consultorio){
        String imagemPath = consultorio.getImagem();

        if (imagemPath == null || imagemPath.isEmpty()) {
            throw new ResourceNotFoundException("Imagem não encontrada");
        }

        return fileStorageService.loadFileAsResource(imagemPath);

    }

    @Transactional
    public void deleteImagem(){
        Users user  =usersService.findUsers();
        fileStorageService.deleteFile(findImagemByConsultorio(user.getConsultorio()).getFilename());
    }


    @Transactional
    public Page<ConsultorioDto> findAll(Pageable pages, Estado estado){
        Page<Consultorio> consultorios;
        if (estado != null) {
            consultorios = consultorioRepository.findAllByEstado(estado,pages);
        }
        else {
            consultorios = consultorioRepository.findAll(pages);
        }
        return consultorios.map(consultorio -> convertToDto(consultorio, ConsultorioDto.class));
    }

    @Transactional
    public ConsultorioDto update(ConsultorioUpdateDto consultorioDto, MultipartFile imagem){
        String imagemString = fileStorageService.saveFile(imagem);
        Users users = usersService.findUsers();
        long id = users.getConsultorio().getId();
        existsById(id);
        Consultorio consultorio = consultorioRepository.getReferenceById(id);
        if (imagemString == null ) imagemString = consultorio.getImagem();
        else fileStorageService.deleteFile(consultorio.getImagem());
        convertToEntityVoid(consultorioDto, consultorio);
        consultorio.setImagem(imagemString);
        consultorio = consultorioRepository.save(consultorio);
        return convertToDto(consultorio, ConsultorioDto.class);
    }

    @Transactional
    public void delete(Long id) {
        existsById(id);
        try {
            consultorioRepository.deleteById(id);
        }catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Não foi possível excluir este consultorio devido a ele tem uma relação em outra tabela.");
        }catch (Exception e){
            throw new DataBaseException("Erro inesperado ao deletar o consultorio");
        }
    }

    @Transactional
    public void existsById(Long id){
        if(!consultorioRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não encontrado: " + id);
        }
    }

    @Transactional
    public ConsultorioDto addVeterinario(Long idVeterinario) {
        Users users = usersService.findUsers();
        long idConsultorio = users.getConsultorio().getId();
        existsById(idConsultorio);
        Veterinario veterinario =
                veterinarioService.findById(idVeterinario)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio));

        Consultorio consultorio = consultorioRepository.getReferenceById(idConsultorio);
        if (consultorio.getVeterinario() == null) {
            consultorio.setVeterinario(new ArrayList<>());
        }
        if (consultorio.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Consultório já está cadastrado no veterinário");
        }
        consultorio.getVeterinario().add(veterinario);
         consultorio = consultorioRepository.save(consultorio);

        return convertToDto(consultorio, ConsultorioDto.class);
    }
    @Transactional
    public void addVeterinarioWithConsultorioId(Long idVeterinario, long idConsultorio) {

        existsById(idConsultorio);
        Consultorio consultorio = consultorioRepository.findById(idConsultorio)
                .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio));

        Veterinario veterinario = veterinarioService.findById(idVeterinario)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário não encontrado com ID: " + idVeterinario));

        if (consultorio.getVeterinario() == null) {
            consultorio.setVeterinario(new ArrayList<>());
        }

        if (consultorio.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Veterinário já está cadastrado neste consultório");
        }
        consultorio.getVeterinario().add(veterinario);

        consultorioRepository.save(consultorio);

    }
    @Transactional
    public void removeVeterinario( Long idConsultorio, Long idVeterinario) {
        existsById(idConsultorio);
        Veterinario veterinario =
                veterinarioService.findById(idVeterinario)
                        .orElseThrow(() -> new ResourceNotFoundException("Consultório não encontrado com ID: " + idConsultorio));

        Consultorio consultorio = consultorioRepository.getReferenceById(idConsultorio);
        if (consultorio.getVeterinario() == null) {
            throw new DataBaseException("Veterinário não possui consultórios cadastrados");
        }
        if (!consultorio.getVeterinario().contains(veterinario)) {
            throw new DataBaseException("Veterinario não está cadastrado no Consultório");
        }
        consultorio.getVeterinario().remove(veterinario);
        consultorioRepository.save(consultorio);

    }
    @Transactional
    public Page<VeterinarioSimpleDto> findAllVeterinario(long idConsultorio, Pageable pages){
        existsById(idConsultorio);
        Page<Veterinario> veterinario;
        veterinario = consultorioRepository.findAllVeterinarioByConsultorioId(idConsultorio, pages);


        return veterinario.map(veterinarios -> convertToDto(veterinarios, VeterinarioSimpleDto.class));
    }

    @Transactional
    public ConsultorioDto addCliente(Long idConsultorio, Long idCliente) {
        existsById(idConsultorio);
        Cliente cliente =
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente));

        Consultorio consultorio = consultorioRepository.getReferenceById(idConsultorio);
        if (consultorio.getCliente() == null) {
            consultorio.setCliente(new ArrayList<>());
        }
        if (consultorio.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente já está cadastrado no veterinário");
        }
        consultorio.getCliente().add(cliente);

        consultorio = consultorioRepository.save(consultorio);

        return convertToDto(consultorio, ConsultorioDto.class);
    }

    @Transactional
    public void removeCliente(Long idCliente) {
        Users users  =usersService.findUsers();
        long idConsultorio = users.getConsultorio().getId();

        existsById(idConsultorio);
        Cliente cliente =
                clienteService.findById(idCliente)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + idCliente));

        Consultorio consultorio = consultorioRepository.getReferenceById(idConsultorio);
        if (consultorio.getCliente() == null) {
            throw new DataBaseException("Veterinário não possui clientes cadastrados");
        }
        if (!consultorio.getCliente().contains(cliente)) {
            throw new DataBaseException("Cliente não está cadastrado no veterinário");
        }
        consultorio.getCliente().remove(cliente);
        consultorioRepository.save(consultorio);

    }
    @Transactional
    public Page<ClienteSimpleDto> findAllCliente(long idConsultorio, Pageable pages){
        existsById(idConsultorio);

        Page<Cliente> clientes = consultorioRepository.findAllClienteByConsultorioId(idConsultorio, pages);

        return clientes.map(cliente -> convertToDto(cliente, ClienteSimpleDto.class));
    }

}
