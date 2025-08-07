package com.security.service;

import com.model.Users;
import com.security.Role;
import com.security.UsersRepository;
import com.security.dto.Newpassword;
import com.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

import static com.extras.Converters.convertToEntity;


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
        Users user = usersRepository.findByEmail(email);
        String token = tokenService.generateAccessToken(user.getId());
        emailService.sendEmail(email, token);
    }

    public void resetPassword(String token, String newPassword){
        tokenService.validateAccessToken(token);
        long id = Long.parseLong(tokenService.getSubjectFromToken(token));
        Optional<Users> usersOptional = usersRepository.findById(id);

        Users user = usersOptional.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if(!newPassword.isEmpty()){


            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);

            updateUser(convertToEntity(user, UserDetails.class));

        } else{
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }

    }
    @Override
    public void createUser(UserDetails userDetails) {
        Users user = (Users) usersRepository.findByEmail(userDetails.getUsername());
        usersRepository.save(user);
    }

    @Override
    public void updateUser(UserDetails user) {
        Users userEntity = convertToEntity(user, Users.class);
        usersRepository.save(userEntity);
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

