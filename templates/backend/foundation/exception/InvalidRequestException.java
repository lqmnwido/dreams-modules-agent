package {{package}}.exception;

import org.springframework.http.HttpStatus;

public class InvalidRequestException extends ApiException {
    public InvalidRequestException(String safeMessage) {
        super(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", safeMessage);
    }
}
