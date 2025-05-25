package com.security;

import com.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    UsersRepository usersRepository;
    @Override

    public UserDetails loadUserByUsername(String login) {
        return usersRepository.findByLogin(login);
    }
    public String authenticate(){
        return "token";
    }
}
