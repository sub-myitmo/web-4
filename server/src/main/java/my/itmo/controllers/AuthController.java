package my.itmo.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import my.itmo.network.AuthResponse;
import my.itmo.network.LoginRequest;
import my.itmo.network.LoginWithTwoFactorRequest;
import my.itmo.network.RegisterRequest;
import my.itmo.services.interfaces.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody @Valid RegisterRequest regRequest) {
        log.info("Пришёл запрос на register");

        return userService.register(regRequest);
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Resource found");
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginWithTwoFactorRequest logRequest) {
        log.info("Пришёл запрос на login");
        return userService.login(logRequest);
    }

    @PostMapping("/first-login")
    public String firstLogin(@RequestBody @Valid LoginRequest logRequest) {
        log.info("Пришёл запрос на firstLogin");
        return userService.login(logRequest);
    }

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@RequestBody @Valid LoginRequest logRequest) {
//        SecurityContextHolder.getContext().getAuthentication()
//
//        log.info("Пришёл запрос на logout");
//        return ResponseEntity.ok("Вы успешно вышли из профиля");
//    }
}

