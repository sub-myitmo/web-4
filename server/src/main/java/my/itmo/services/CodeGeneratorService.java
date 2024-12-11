package my.itmo.services;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class CodeGeneratorService {

    private final Random random = new Random();

    public String generateSixDigitCode() {
        int code = 100000 + random.nextInt(900000); // Генерирует число от 100000 до 999999
        return String.valueOf(code);
    }
}
