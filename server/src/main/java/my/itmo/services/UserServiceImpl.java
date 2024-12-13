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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CodeGeneratorService codeGeneratorService;

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
    public ChangeProfileDataResponse change(ChangeDataRequest changeRequest) {
        User user = userRepository.findById(getUserIdFromToken())
                .orElseThrow(() -> new UsernameNotFoundException("Нет юзера с id: " + getUserIdFromToken()));

        // проверка, есть ли уже пользователь с таким username
        Optional<User> checkUser = userRepository.findByUsername(changeRequest.data());

        if (checkUser.isEmpty()) {
            user.setUsername(changeRequest.data());
            userRepository.save(user);
            log.info(user.getUsername());
            return new ChangeProfileDataResponse(true);
        }
        return new ChangeProfileDataResponse(false);
    }

    @Override
    public ChangeProfileDataResponse changePassword(ChangeDataRequest changeRequest) {
        User user = userRepository.findById(getUserIdFromToken())
                .orElseThrow(() -> new UsernameNotFoundException("Нет юзера с id: " + getUserIdFromToken()));

        try {
            user.setPassword(passwordEncoder.encode(changeRequest.data()));
            userRepository.save(user);

            emailService.sendConfirmationEmail(user.getEmail(), "Смена пароля", "Здравствуйте, вы успешно сменили пароль от аккаунта на " + changeRequest.data() + "!");
            log.info(user.getUsername());
            return new ChangeProfileDataResponse(true);
        } catch (Exception e) {
            return new ChangeProfileDataResponse(false);

        }
    }



    public Long getUserIdFromToken() {
        Claims credentials = (Claims) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        log.info("user id {}", credentials.get("id"));
        return Long.parseLong(credentials.get("id").toString());
    }

    @Override
    public String login(LoginRequest logRequest) {
        Optional<User> try_user = userRepository.findByEmail(logRequest.emailOrUsername());
        User user;
        if (try_user.isEmpty()) {
            user = userRepository.findByUsername(logRequest.emailOrUsername()).orElseThrow(() -> new UsernameNotFoundException("Нет юзера с email/username: " + logRequest.emailOrUsername()));
        } else user = try_user.get();

        if (!passwordEncoder.matches(logRequest.password(), user.getPassword())) {
            throw new UsernameNotFoundException("Неверный пароль для юзера:" + logRequest.emailOrUsername());
        }


        String code = codeGeneratorService.generateSixDigitCode();
        user.setSecondFactorCode(code);
        user.setTimeCode(System.currentTimeMillis());
        userRepository.save(user);

        emailService.sendConfirmationEmail(user.getEmail(), "Двух-факторная аутентификация", "Ваш код: " + code + "\nБудьте внимательны, он действует только 1 минуту!");

        return "check two-factor";
    }

    @Override
    public AuthResponse login(LoginWithTwoFactorRequest logRequest) {
        Optional<User> try_user = userRepository.findByEmail(logRequest.emailOrUsername());
        User user;
        if (try_user.isEmpty()) {
            user = userRepository.findByUsername(logRequest.emailOrUsername()).orElseThrow(() -> new UsernameNotFoundException("Нет юзера с email/username: " + logRequest.emailOrUsername()));
        } else user = try_user.get();

        if (!passwordEncoder.matches(logRequest.password(), user.getPassword())) {
            throw new UsernameNotFoundException("Неверный пароль для юзера:" + logRequest.emailOrUsername());
        }
        if (System.currentTimeMillis() - user.getTimeCode() >= 60000) {
            throw new UsernameNotFoundException("Слишком долгая реакция для юзера:" + logRequest.emailOrUsername());
        }

        if (Objects.equals(user.getSecondFactorCode(), logRequest.code())) {
            String token = jwtUtil.createToken(user);
            log.info("token, который сгенерировался = {}", token);

            user.setSecondFactorCode(null);
            user.setTimeCode(null);
            userRepository.save(user);

            return new AuthResponse(token);
        }
        else {

            return new AuthResponse(null);
        }
    }

    @Override
    public AuthResponse register(RegisterRequest regRequest) {
        Optional<User> checkUser = userRepository.findByEmail(regRequest.email());
        try {
            if (checkUser.isEmpty()) {

                User user = User.builder()
                        .email(regRequest.email())
                        .password(passwordEncoder.encode(regRequest.password()))
                        .build();
                log.info("Создание нового юзера {}", user.getEmail());

                emailService.sendConfirmationEmail(user.getEmail(), "Регистрация", "Здравствуйте! Спасибо за регистрацию.");

                User newUser = create(user);

                String token = jwtUtil.createToken(newUser);


                return new AuthResponse(token);
            } else return new AuthResponse(null);
        } catch (Exception e) {
            log.error("Error in register service");
            e.printStackTrace();
            return new AuthResponse(null);
        }

    }
}
