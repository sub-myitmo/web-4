package my.itmo.services.interfaces;

import my.itmo.dto.PointDTO;
import my.itmo.network.CorrectPointRequest;

import java.util.List;

public interface PointService {
    List<PointDTO> getUserPoints();

    PointDTO addPoint(CorrectPointRequest dto);

    //Long getUserIdFromToken();

    void deleteUserPoints();
}
