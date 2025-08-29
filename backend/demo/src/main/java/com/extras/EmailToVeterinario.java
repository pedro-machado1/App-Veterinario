// email enviado ao veterinario para confirmar a sua conta;

package com.extras;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.web.bind.annotation.*;


@Service
public class EmailToVeterinario {

    @Autowired
    private MailSender mailSender;

    public void sendEmail(String to, String token){


        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime agora = LocalDateTime.now().plusMinutes(60);

        String link = "http://localhost:5173/registerVeterinario?token=" + token;
        String resendLink = "http://localhost:8080/api/emails/resend?to=" + to;

        String body = "Olá, " + to + " Você tem até" + agora.format(formatador) + " para criar a sua conta.\n\n" +
                "Clique no link abaixo para realizar isso :\n\n" +
                link + "\n\n" +
                "Se o link expirou ou você precisa de outro e-mail, clique no link abaixo para reenviar:\n" +
                resendLink + "\n\n" +
                "Atenciosamente,\n" +
                "Equipe da VetHelp";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("pedro.jardim.machado@hotmail.com");
        message.setSubject("Crie o seu usuário");
        message.setText(body);
        mailSender.send(message);

    }

}
