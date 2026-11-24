package {{package}}.exception;

import org.springframework.http.HttpStatus;

public class ResourceConflictException extends ApiException {
    public ResourceConflictException() {
        super(
                HttpStatus.CONFLICT,
                "RESOURCE_CONFLICT",
                "The operation conflicts with the current record");
    }
}
