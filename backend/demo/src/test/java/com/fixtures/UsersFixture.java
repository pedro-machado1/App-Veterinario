package com.fixtures;

import com.model.Users;
import com.security.Role;

public class UsersFixture {

    public static Users usersFixture() {
        Users u = new Users();
         u.setUsername("usuario.teste");
         u.setEmail("usuario.teste@example.com");
         u.setPassword("senha");
         u.setRole(Role.CLIENTE);
        return u;
    }
}
