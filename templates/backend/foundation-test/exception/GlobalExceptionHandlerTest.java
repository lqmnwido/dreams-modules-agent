package {{package}}.exception;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Isolated MVC tests: no database, application startup or live authentication. */
class GlobalExceptionHandlerTest {
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc =
                MockMvcBuilders.standaloneSetup(new ProbeController())
                        .setControllerAdvice(new GlobalExceptionHandler())
                        .build();
    }

    @Test
    void mapsDomainExceptionsAndAccessDenial() throws Exception {
        mvc.perform(get("/missing"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"));
        mvc.perform(get("/conflict"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESOURCE_CONFLICT"));
        mvc.perform(get("/invalid")).andExpect(status().isBadRequest());
        mvc.perform(get("/denied")).andExpect(status().isForbidden());
    }

    @Test
    void unexpectedFailuresNeverExposeTheRawMessage() throws Exception {
        mvc.perform(get("/unexpected"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("The request could not be completed"))
                .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
                .andExpect(jsonPath("$.status").value(500));
    }

    @Test
    void validationReportsFieldAndConstraintWithoutRejectedValue() throws Exception {
        mvc.perform(
                        post("/validate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("name"))
                .andExpect(jsonPath("$.fieldErrors[0].code").value("NotBlank"))
                .andExpect(jsonPath("$.fieldErrors[0].rejectedValue").doesNotExist());
    }

    @Test
    void malformedJsonUsesTheSameSanitizedErrorShape() throws Exception {
        mvc.perform(post("/validate").contentType(MediaType.APPLICATION_JSON).content("not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("HTTP_400"))
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }

    @RestController
    static class ProbeController {
        @GetMapping("/missing")
        void missing() {
            throw new ResourceNotFoundException();
        }

        @GetMapping("/conflict")
        void conflict() {
            throw new ResourceConflictException();
        }

        @GetMapping("/invalid")
        void invalid() {
            throw new InvalidRequestException("Invalid page");
        }

        @GetMapping("/denied")
        void denied() {
            throw new AccessDeniedException("private policy");
        }

        @GetMapping("/unexpected")
        void unexpected() {
            throw new IllegalStateException("password=private; SQL=private");
        }

        @PostMapping("/validate")
        void validate(@Valid @RequestBody Input input) {}
    }

    record Input(@NotBlank String name) {}
}
