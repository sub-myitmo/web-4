package my.itmo.network;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CorrectPointRequest (
        @NotNull @Min(-7) @Max(7)
        Double x,
        @NotNull @Min(-7) @Max(7)
        Double y,
        @NotNull @Min(1) @Max(3)
        Double r
) {
}
