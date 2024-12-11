package my.itmo.services.interfaces;

import my.itmo.dto.UserDTO;
import my.itmo.models.User;
import my.itmo.network.*;
import org.springframework.http.ResponseEntity;

public interface UserService {
    User create(User user);

    UserDTO getCurrentUser();
    ChangeProfileDataResponse change(ChangeDataRequest changeRequest);

    ChangeProfileDataResponse changePassword(ChangeDataRequest changeRequest);

    ResponseEntity<?> login(LoginRequest logRequest);

    AuthResponse login(LoginWithTwoFactorRequest logRequest);

    AuthResponse register(RegisterRequest regRequest);

}
