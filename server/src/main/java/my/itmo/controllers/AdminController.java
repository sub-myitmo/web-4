package my.itmo.controllers;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import my.itmo.dto.UserDTO;
import my.itmo.services.interfaces.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin-panel")
public class AdminController {
    private final AdminService adminService;

    @GetMapping(value = "/getAllUsers")
    public List<UserDTO> getAllUsers() {
        log.info("Пришёл запрос на получение всех пользователей");
        return adminService.getAllUsers();
    }
}
