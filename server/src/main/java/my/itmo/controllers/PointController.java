package my.itmo.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import my.itmo.dto.PointDTO;
import my.itmo.network.CorrectPointRequest;
import my.itmo.services.interfaces.PointService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/point")
public class PointController {
    private final PointService pointService;

    @GetMapping(value = "/getAll")
    public List<PointDTO> getAllPoints() {
        return pointService.getUserPoints();
    }

    @PostMapping(value = "/add")
    public PointDTO addPoint(@RequestBody @Valid CorrectPointRequest dto) {
        return pointService.addPoint(dto);
    }

    @DeleteMapping(value = "/delete")
    public void deletePoints() {
        pointService.deleteUserPoints();
    }
}