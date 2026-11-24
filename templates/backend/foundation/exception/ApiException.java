package {{package}}.exception;

import org.springframework.http.HttpStatus;

/** Only application-authored, safe messages belong in this exception. */
public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String safeMessage) {
        super(safeMessage);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }
}
