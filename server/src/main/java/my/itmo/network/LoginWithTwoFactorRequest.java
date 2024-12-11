package my.itmo.network;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record LoginWithTwoFactorRequest (
        @NotEmpty
        String emailOrUsername,
        @NotBlank
        @Size(min = 5)
        String password,
        @NotBlank
        @Size(min = 6)
        @Size(min = 6)
        String code
) {}
