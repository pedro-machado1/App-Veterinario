package com.security.service;

import org.springframework.beans.factory.annotation.Autowired;
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
        LocalDateTime agora = LocalDateTime.now().plusMinutes(30);

        String link = "http://localhost:5173/verify-email?token=" + token + "&type=cliente";
        String body = "Olá!\n\n" +
                "Bem-vindo à VetHelp! Para confirmar seu email de cadastro, clique no link abaixo:\n\n" +
                link + "\n\n" +
                "Este link é válido até " + agora.format(formatador) + ".\n\n" +
                "Se você não criou esta conta, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Confirme seu Email - VetHelp");
        message.setText(body);
        mailSender.send(message);
    }

    public void sendEmail(String to, String token, String userType) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(30);

        String typeParam = userType.equals("consultorio") ? "consultorio" : "cliente";
        String link = "http://localhost:5173/verify-email?token=" + token + "&type=" + typeParam;
        
        String tipoUsuario = userType.equals("consultorio") ? "consultório" : "cliente";
        
        String body = "Olá!\n\n" +
                "Bem-vindo à VetHelp! Para confirmar seu email de cadastro como " + tipoUsuario + ", clique no link abaixo:\n\n" +
                link + "\n\n" +
                "Este link é válido até " + agora.format(formatador) + ".\n\n" +
                "Se você não criou esta conta, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Confirme seu Email - VetHelp");
        message.setText(body);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token){
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(20);

        String link = "http://localhost:5173/reset-password?token=" + token;
        String body = "Olá!\n\n" +
                "Você solicitou para redefinir sua senha. Clique no link abaixo para continuar:\n\n" +
                link + "\n\n" +
                "Este link é válido até " + agora.format(formatador) + ".\n\n" +
                "Se você não solicitou isso, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Redefinir Senha - VetHelp");
        message.setText(body);
        mailSender.send(message);
    }
}

