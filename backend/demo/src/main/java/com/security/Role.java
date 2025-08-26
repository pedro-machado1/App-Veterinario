package com.security;

public enum Role {

    ADMIN("ROLE_ADMIN"),
    CLIENTE("ROLE_CLIENTE"),
    VETERINARIO("ROLE_VETERINARIO"),
    CONSULTORIO("ROLE_CONSULTORIO");

    private String role;

    Role(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
