package com.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    // only for testing
    @Value("${spring.mail.username}")
    private String mailUser;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String token, String userType) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(30);

        String typeParam = userType.equals("consultorio") ? "consultorio" : "cliente";
        String link = frontendUrl + "/verify-email?token=" + token + "&type=" + typeParam;

        String tipoUsuario = userType.equals("consultorio") ? "consultório" : "cliente";

        String body = "Olá!\n\n" +
                "Bem-vindo à VetHelp! Para confirmar seu email de cadastro como " + tipoUsuario + ", clique no link abaixo:\n\n" +
                link + "\n\n" +
                "Este link é válido até " + agora.format(formatador) + ".\n\n" +
                "Se você não criou esta conta, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailUser);
        message.setSubject("Confirme seu Email - VetHelp");
        message.setText(body);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token){
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(20);

        String link = frontendUrl + "/reset-password?token=" + token;
        String body = "Olá!\n\n" +
                "Você solicitou para redefinir sua senha. Clique no link abaixo para continuar:\n\n" +
                link + "\n\n" +
                "Este link é válido até " + agora.format(formatador) + ".\n\n" +
                "Se você não solicitou isso, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailUser);
        message.setSubject("Redefinir Senha - VetHelp");
        message.setText(body);
        mailSender.send(message);
    }



    public void sendEmailVeterinario(String to, String token){

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(60);

        String link = frontendUrl + "/registerVeterinario?token=" + token;
        String resendLink = backendUrl + "/emails/resend?to=" + to + "&token=" + token;

        String body = "Olá, " + to + " Você tem até" + agora.format(formatador) + " para criar a sua conta.\n\n" +
                "Clique no link abaixo para realizar isso :\n\n" +
                link + "\n\n" +
                "Se o link expirou ou você precisa de outro e-mail, clique no link abaixo para reenviar:\n" +
                resendLink + "\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailUser);
        message.setSubject("Crie o seu usuário");
        message.setText(body);
        mailSender.send(message);

    }
}

