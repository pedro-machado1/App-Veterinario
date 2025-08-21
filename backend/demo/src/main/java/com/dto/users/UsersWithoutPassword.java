package com.dto.users;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.security.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersWithoutPassword {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    private String username;

    private String email;

    private Role role;

}
