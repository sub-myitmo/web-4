package my.itmo.utils;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import my.itmo.models.User;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtUtil {

    @Value("${my.config.key}")
    private String secretKey;

    public static final String TOKEN_HEADER_NAME = "Authorization";
    public static final String PREFIX = "Bearer ";

    public String createToken(User user) {
        //Claims claims = (Claims) Jwts.claims().setSubject(user.getEmail());

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("email", user.getEmail());

        return Jwts
                .builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 100000 * 60 * 24))
                .signWith(getKey())
                .compact();
    }

    public String resolveToken(HttpServletRequest request) {
        String authHeader = request.getHeader(TOKEN_HEADER_NAME);

        if (authHeader != null && authHeader.startsWith(PREFIX)) {
            return authHeader.substring(PREFIX.length());
        }
        return null;
    }

    /**
     * Извлечение имени пользователя из токена
     *
     * @param token токен
     * @return имя пользователя
     */
    public String extractData(String token) {
        return (Jwts.parser().setSigningKey(getKey()).build().parseSignedClaims(token).getPayload()).toString();
    }

    public Claims resolveClaims(String token) {
        log.info("в методе resolveClaims");
        return (Jwts.parser().setSigningKey(getKey()).build()).parseClaimsJws(token).getBody();
    }

    public boolean isTokenValid(Claims claims) throws AuthenticationException {
        return claims.getExpiration().after(new Date());
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secretKey));
    }
}
