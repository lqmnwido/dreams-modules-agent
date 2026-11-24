package {{package}}.exception;

import java.time.Instant;
import java.util.List;

public record ErrorDetails(
        Instant timestamp, int status, String code, String message, List<FieldError> fieldErrors) {
    public ErrorDetails {
        fieldErrors = List.copyOf(fieldErrors);
    }

    /** No rejected value is returned; it may contain sensitive input. */
    public record FieldError(String field, String code) {}
}
