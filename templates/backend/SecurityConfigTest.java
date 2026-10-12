package {{package}}.security;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.WebApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SecurityConfigTest {
    private WebApplicationContextRunner runner(boolean mockDecoder) {
        WebApplicationContextRunner runner = new WebApplicationContextRunner()
            .withUserConfiguration(TestMvc.class, SecurityConfig.class, MethodSecurityConfig.class);
        if (mockDecoder) {
            runner = runner.withBean(JwtDecoder.class, () -> token -> {
                if (!"valid-test-token".equals(token)) throw new BadJwtException("Invalid test token");
                return Jwt.withTokenValue(token).header("alg", "RS256")
                    .subject("test-user").claim("scope", "read").build();
            });
        }
        return runner;
    }

    @Test
    void secureByDefaultRequiresTokenAndEnforcesMethodPermissions() {
        runner(true).run(context -> {
            assertThat(context).hasNotFailed();
            MockMvc mvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity()).build();
            mvc.perform(get("/probe")).andExpect(status().isUnauthorized());
            mvc.perform(get("/probe").header("Authorization", "Bearer valid-test-token"))
                .andExpect(status().isOk());
            mvc.perform(get("/probe").header("Authorization", "Bearer invalid-test-token"))
                .andExpect(status().isUnauthorized());
            mvc.perform(get("/probe/restricted").header("Authorization", "Bearer valid-test-token"))
                .andExpect(status().isForbidden());
        });
    }

    @Test
    void localProfileAloneStillRequiresToken() {
        runner(true).withPropertyValues("spring.profiles.active=local", "server.address=127.0.0.1")
            .run(context -> {
                assertThat(context).hasNotFailed();
                MockMvcBuilders.webAppContextSetup(context)
                    .apply(SecurityMockMvcConfigurers.springSecurity()).build()
                    .perform(get("/probe")).andExpect(status().isUnauthorized());
            });
    }

    @Test
    void localBypassNeedsNoTokenOrIssuerAndDisablesMethodPermissions() {
        runner(false).withPropertyValues("spring.profiles.active=local",
                "dreams.security.enabled=false", "server.address=127.0.0.1")
            .run(context -> {
                assertThat(context).hasNotFailed();
                assertThat(context).doesNotHaveBean(JwtDecoder.class);
                MockMvc mvc = MockMvcBuilders.webAppContextSetup(context)
                    .apply(SecurityMockMvcConfigurers.springSecurity()).build();
                mvc.perform(get("/probe")).andExpect(status().isOk());
                mvc.perform(get("/probe/restricted")).andExpect(status().isOk());
            });
    }

    @Test
    void bypassFailsForDefaultProductionStagingMixedProfilesOrNetworkBinding() {
        for (String profiles : new String[] {"", "production", "staging", "local,production"}) {
            runner(false).withPropertyValues("spring.profiles.active=" + profiles,
                    "dreams.security.enabled=false", "server.address=127.0.0.1")
                .run(context -> assertThat(context).hasFailed());
        }
        for (String address : new String[] {"", "0.0.0.0", "192.168.1.10", "localhost"}) {
            runner(false).withPropertyValues("spring.profiles.active=local",
                    "dreams.security.enabled=false", "server.address=" + address)
                .run(context -> assertThat(context).hasFailed());
        }
    }

    @Test
    void secureModeWithoutIssuerFailsClosed() {
        runner(false).run(context -> assertThat(context).hasFailed());
    }

    @Configuration(proxyBeanMethods = false)
    @EnableWebMvc
    @Import(ProbeController.class)
    static class TestMvc { }

    @RestController
    static class ProbeController {
        @GetMapping("/probe")
        String probe() { return "ok"; }

        @GetMapping("/probe/restricted")
        @PreAuthorize("hasRole('TEST_ONLY')")
        public String restricted() { return "ok"; }
    }
}
