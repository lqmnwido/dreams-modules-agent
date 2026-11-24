package {{package}}.exception;

import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Object> handleApiException(ApiException exception) {
        return response(
                exception.getStatus(), exception.getCode(), exception.getMessage(), List.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException exception) {
        return response(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "Access denied", List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpected(Exception exception) {
        // Exception messages/stack traces may contain SQL, tokens or personal data.
        LOG.error("Unhandled API failure of type {}", exception.getClass().getName());
        return response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "The request could not be completed",
                List.of());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        List<ErrorDetails.FieldError> errors =
                exception.getBindingResult().getFieldErrors().stream()
                        .map(
                                error ->
                                        new ErrorDetails.FieldError(
                                                error.getField(), error.getCode()))
                        .toList();
        return response(
                HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Request validation failed", errors);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception,
            Object body,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        ErrorDetails details =
                new ErrorDetails(
                        Instant.now(),
                        status.value(),
                        "HTTP_" + status.value(),
                        "The HTTP request could not be processed",
                        List.of());
        return new ResponseEntity<>(details, headers, status);
    }

    private ResponseEntity<Object> response(
            HttpStatus status, String code, String message, List<ErrorDetails.FieldError> errors) {
        return ResponseEntity.status(status)
                .body(new ErrorDetails(Instant.now(), status.value(), code, message, errors));
    }
}
