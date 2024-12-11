package my.itmo.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(nullable = false, unique = true, name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(nullable = false, name = "email")
    private String email;

    @Column(nullable = false, name = "password")
    private String password;

//    @Column(nullable = false, name = "verified")
//    private Boolean isVerified;

    @Column(name = "secondFactorCode")
    private String secondFactorCode;

    @Column(name = "timeCode")
    private Long timeCode;

//    @OneToMany(fetch=FetchType.EAGER)
//    @JoinColumn(name="user_id")
//    private List<Point> points;
}