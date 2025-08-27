package com.dto.users;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.dto.consultorio.ConsultorioSimpleDto;
import com.dto.veterinario.VeterinarioSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.security.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usersdto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    private String username;

    private String email;

    private String password;

    private Role role;

    private ClienteSimpleDto cliente;

    private ConsultorioSimpleDto consultorio;
}
