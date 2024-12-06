package my.itmo.services.interfaces;

import my.itmo.dto.UserDTO;
import my.itmo.models.User;
import my.itmo.network.*;

public interface UserService {
    User create(User user);

    UserDTO getCurrentUser();
    ChangeUsernameResponse change(ChangeUsernameRequest changeRequest);

    AuthResponse login(LoginRequest logRequest);
    AuthResponse register(RegisterRequest regRequest);

}
