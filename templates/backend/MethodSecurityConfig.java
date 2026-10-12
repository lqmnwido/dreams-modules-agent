package {{package}}.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(name = "dreams.security.enabled", havingValue = "true", matchIfMissing = true)
@EnableMethodSecurity
public class MethodSecurityConfig {
}
