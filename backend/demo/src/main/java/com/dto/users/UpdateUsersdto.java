package com.dto.users;

import com.dto.cliente.ClienteDto;
import com.dto.cliente.ClienteSimpleDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.security.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUsersdto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    private String email;

    private String password;

    private Role role;

    private ClienteSimpleDto cliente;
}
