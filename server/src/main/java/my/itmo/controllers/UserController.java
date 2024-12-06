package my.itmo.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import my.itmo.dto.UserDTO;
import my.itmo.network.ChangeUsernameRequest;
import my.itmo.network.ChangeUsernameResponse;
import my.itmo.services.interfaces.UserService;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/change")
    public ChangeUsernameResponse change(@RequestBody @Valid ChangeUsernameRequest changeRequest) {
        log.info("Пришёл запрос на смену username");
        return userService.change(changeRequest);
    }

    @GetMapping(value = "/getProfile")
    public UserDTO getUser() {
        log.info("Пришёл запрос на данные пользователя");
        return userService.getCurrentUser();
    }

}
