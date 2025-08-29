package com.extras;

import com.security.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailResendController {

    @Autowired
    private  EmailToVeterinario emailToVeterinario;

    @Autowired
    private TokenService tokenService;



    @GetMapping("/resend")
    public ResponseEntity<String> resend(@RequestParam String to) {
        String novoToken=tokenService.generateTokenForVeterinario(to);
        emailToVeterinario.sendEmail(to, novoToken);
        return ResponseEntity.ok("Novo e-mail enviado para " + to);
    }
}

