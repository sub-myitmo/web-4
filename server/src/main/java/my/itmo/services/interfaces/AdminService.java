package my.itmo.services.interfaces;

import my.itmo.dto.PointDTO;
import my.itmo.dto.UserDTO;

import java.util.List;

public interface AdminService {
    List<UserDTO> getAllUsers();
}
