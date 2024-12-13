package my.itmo.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") private String sender;

    public void sendConfirmationEmail(String toEmail, String subject, String body) {
        log.info("Sending confirmation email to {}", toEmail);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        log.info("log1");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        log.info("log2");

        try {
            mailSender.send(message);
            log.info("log3");
            //log.info("Sending confirmation email to {}", toEmail);
        } catch (Exception e) {log.error("error while sending confirmation email to {}", toEmail, e);}
    }
}
