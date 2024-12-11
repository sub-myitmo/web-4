package my.itmo.network;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeDataRequest(
        // пароль или юзернейм приходит
        @NotBlank
        @Size(min = 5)
        String data
) {
}
