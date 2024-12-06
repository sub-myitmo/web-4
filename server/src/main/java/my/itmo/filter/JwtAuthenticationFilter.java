package my.itmo.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import my.itmo.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwt;
    private final ObjectMapper mapper;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        log.info("Зашёл в doFilterInternal");
        Map<String, Object> error = new HashMap<>();
        try {
            String token = jwt.resolveToken(request);
            log.info("токен из запроса: {}", token);

            if (token == null) {
                log.info("token - null");
                filterChain.doFilter(request, response);
                return;
            }

            log.info(jwt.extractData(token));

            Claims claims = jwt.resolveClaims(token);

            if (jwt.isTokenValid(claims) && SecurityContextHolder.getContext().getAuthentication() == null) {
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken("", claims, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            error.put("error", "Authentication Error: token invalid");
            error.put("description", e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(response.getWriter(), error);
            //log.info(response.getWriter().toString());
            //e.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }

}
