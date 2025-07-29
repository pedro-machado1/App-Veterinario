package com.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String token){
        String link = "http://localhost:8080/api/auth/reset-password?token=" + token;
        String subject ="Recuperação de senha";
        String body = "Olá, " + to + ".\n\n" +
                "Clique no link abaixo para confirmar seu email:\n\n" +
                link + "\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("pedro.jardim.machado@hotmail.com");
        message.setSubject("Recuperação de senha VetHelp");
        message.setText(body);
        mailSender.send(message);

    }
}
