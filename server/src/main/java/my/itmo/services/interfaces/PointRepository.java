package my.itmo.services.interfaces;

import my.itmo.models.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    List<Point> findPointsByUserId(Long user_id);
    void deletePointsByUserId(Long user_id);
}
