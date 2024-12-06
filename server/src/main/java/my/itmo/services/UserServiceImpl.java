package my.itmo.services;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import my.itmo.dto.UserDTO;
import my.itmo.models.User;
import my.itmo.network.*;
import my.itmo.services.interfaces.UserRepository;
import my.itmo.services.interfaces.UserService;
import my.itmo.utils.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

//    private final PointService pointService;

    @Override
    public User create(User user) {
        User newUser = userRepository.save(user);
        userRepository.flush();
        return newUser;
    }

    @Override
    public UserDTO getCurrentUser() {
        return userRepository.findById(getUserIdFromToken())
                .stream()
                .max(Comparator.comparingLong(User::getId))
                .map(user -> new UserDTO(user.getId(), user.getEmail(), user.getUsername())).get();

    }

    @Override
    public ChangeUsernameResponse change(ChangeUsernameRequest changeRequest) {
        User user = userRepository.findById(getUserIdFromToken())
                .orElseThrow(() -> new UsernameNotFoundException("Нет юзера с id: " + getUserIdFromToken()));

        // проверка, есть ли уже пользователь с таким username
        Optional<User> checkUser = userRepository.findByUsername(changeRequest.username());

        if (checkUser.isEmpty()) {
            user.setUsername(changeRequest.username());
            userRepository.save(user);
            log.info(user.getUsername());
            return new ChangeUsernameResponse(true);
        }
        return new ChangeUsernameResponse(false);
    }

    public Long getUserIdFromToken() {
        Claims credentials = (Claims) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        log.info("user id {}", credentials.get("id"));
        return Long.parseLong(credentials.get("id").toString());
    }


    @Override
    public AuthResponse login(LoginRequest logRequest) {
        Optional<User> try_user = userRepository.findByEmail(logRequest.emailOrUsername());
        User user;
        if (try_user.isEmpty()) {
            user = userRepository.findByUsername(logRequest.emailOrUsername()).orElseThrow(() -> new UsernameNotFoundException("Нет юзера с email/username: " + logRequest.emailOrUsername()));
        } else user = try_user.get();

        if (!passwordEncoder.matches(logRequest.password(), user.getPassword())) {
            throw new UsernameNotFoundException("Неверный пароль для юзера:" + logRequest.emailOrUsername());
        }

        String token = jwtUtil.createToken(user);
        log.info("token, который сгенерировался = {}", token);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse register(RegisterRequest regRequest) {
        Optional<User> checkUser = userRepository.findByEmail(regRequest.email());
        if (checkUser.isEmpty()) {

            User user = User.builder()
                    .email(regRequest.email())
                    .password(passwordEncoder.encode(regRequest.password()))
                    .isVerified(false)
                    .build();
            log.info("Создание нового юзера {}", user.getEmail());

            User newUser = create(user);

            String token = jwtUtil.createToken(newUser);

            return new AuthResponse(token);
        } else return new AuthResponse(null);
    }
}
