package com.security.service;

import com.model.Users;
import com.security.Role;
import com.security.UsersRepository;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import static com.extras.Converters.convertToEntity;
import static com.extras.Converters.convertToEntityVoid;


@Service
public class AuthenticationService implements UserDetailsManager {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email){
        try {
            return usersRepository.findByEmail(email);
        }catch (Exception e){
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }

    }

    public void requestNewPassword(String email){
        String token = tokenService.generateTokenWithEmail(email);
        emailService.sendEmail(email, token);
    }

    public void resetPassword(String token, String newPassword){
        Users user = (Users) usersRepository.findByEmail(tokenService.getSubjectFromToken(token));
        if(!newPassword.isEmpty()){

//            update user

            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            Role role= user.getRole();

            updateUser(convertToEntity(user, UserDetails.class));

        } else{
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }

    }
    @Override
    public void createUser(UserDetails userDetails) {

    }

    @Override
    public void updateUser(UserDetails user) {
        Users userEntity = convertToEntity(user, Users.class);
        usersRepository.save(userEntity);
        return;
    }


    @Override
    public void deleteUser(String username) {
        usersRepository.deleteByUsername(username);
        return;
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {

    }

    @Override
    public boolean userExists(String username) {
        return usersRepository.findByEmail(username) != null;
    }
}

