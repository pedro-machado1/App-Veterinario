package com.dto.veterinario;

import com.model.Estado;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VeterinarioUpdateDto {
    private String cpf;

    private String nome;

    private String crvm;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private String telefone;

    private String endereco;

    private String imagem;


}
