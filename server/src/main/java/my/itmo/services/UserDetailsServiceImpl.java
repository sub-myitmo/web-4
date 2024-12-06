package my.itmo.services;

import lombok.RequiredArgsConstructor;
import my.itmo.models.User;
import my.itmo.services.interfaces.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        Optional<User> try_user = userRepository.findByEmail(emailOrUsername);
        User user;
        if (try_user.isEmpty()) {
            user = userRepository.findByUsername(emailOrUsername).orElseThrow(() -> new UsernameNotFoundException("Нет юзера с email/username:: " + emailOrUsername));
        } else user = try_user.get();

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }
}
