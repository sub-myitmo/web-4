package my.itmo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import my.itmo.network.CorrectPointRequest;

import java.text.SimpleDateFormat;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "points")
@Getter
@Setter
public class Point {
    @Id
    @Column(nullable = false, unique = true, name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "x")
    private Double x;

    @Column(nullable = false, name = "y")
    private Double y;

    @Column(nullable = false, name = "r")
    private Double r;

    @Column(nullable = false, name = "result")
    private Boolean result = false;

    @Column(nullable = false, name="user_id")
    private Long userId;

    @Column(nullable = false, name = "cur_time")
    private String currentTime;

    public Point(CorrectPointRequest dto, Long userId) {
        x = dto.x();
        y = dto.y();
        r = dto.r();
        result = checkPoint();
        currentTime = new SimpleDateFormat("HH:mm:ss dd.MM.yyyy").format(new Date(System.currentTimeMillis()));
        this.userId = userId;
    }

    private boolean checkPoint() {
        return (x > 0 && y >= 0 && (y <= r / 2 - 0.5 * x)) ||
                (x < 0 && y <= 0 && (Math.sqrt(x * x + y * y) <= r)) ||
                (x <= 0 && y >= 0 && (x >= -r) && (y <= r));
    }
}
