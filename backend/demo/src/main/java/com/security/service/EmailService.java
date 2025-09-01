package com.security.service;

import com.fasterxml.jackson.databind.DatabindException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String token){
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(20);

        String link = "http://localhost:5173/reset-password?token=" + token;
        String body = "Olá, " + to + " Você tem até" + agora.format(formatador) + " para redefinir a sua senha.\n\n" +
                "Clique no link abaixo para confirmar seu email:\n\n" +
                link + "\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("pedro.jardim.machado@hotmail.com ");
        message.setSubject("Recuperação de senha VetHelp");
        message.setText(body);
        mailSender.send(message);

    }
}
