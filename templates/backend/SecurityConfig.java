package {{package}}.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger LOG = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, Environment environment,
            @Value("${dreams.security.enabled:true}") boolean enabled,
            ObjectProvider<JwtDecoder> decoders) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .logout(logout -> logout.disable());

        if (enabled) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.decoder(decoders.getObject())));
        } else {
            String[] profiles = environment.getActiveProfiles();
            String address = environment.getProperty("server.address", "");
            if (profiles.length != 1 || !"local".equals(profiles[0])
                    || !("127.0.0.1".equals(address) || "::1".equals(address))) {
                throw new IllegalStateException("Disabling API security requires only the local profile and a loopback server.address.");
            }
            LOG.warn("API security disabled for local testing on {}. No authenticated user identity is available.", address);
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        }
        return http.build();
    }

    @Bean
    @ConditionalOnProperty(name = "dreams.security.enabled", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean(JwtDecoder.class)
    JwtDecoder jwtDecoder(@Value("${dreams.security.issuer-uri:}") String issuer) {
        if (issuer.isBlank()) {
            throw new IllegalStateException("KEYCLOAK_ISSUER_URI is required when API security is enabled.");
        }
        return JwtDecoders.fromIssuerLocation(issuer);
    }
}
