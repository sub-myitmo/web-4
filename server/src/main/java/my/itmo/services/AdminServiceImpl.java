package my.itmo.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import my.itmo.dto.PointDTO;
import my.itmo.dto.UserDTO;
import my.itmo.services.interfaces.AdminService;
import my.itmo.services.interfaces.UserRepository;
import my.itmo.services.interfaces.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static java.util.Arrays.stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public List<UserDTO> getAllUsers() {
        if (Objects.equals(userService.getCurrentUser().username(), "parzi")) {
            return userRepository.findAll()
                    .stream()
                    .map(user -> new UserDTO(user.getId(), user.getEmail(), user.getUsername())).toList();
        } else return null;
    }
}
