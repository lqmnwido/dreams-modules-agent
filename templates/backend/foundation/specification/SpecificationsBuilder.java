package {{package}}.specification;

import jakarta.persistence.criteria.Path;
import java.util.Locale;
import java.util.Objects;
import org.springframework.data.jpa.domain.Specification;

/** Fields are application-defined entity paths, never arbitrary request parameters. */
public final class SpecificationsBuilder<T> {
    public Specification<T> equalTo(String field, Object value) {
        validateField(field);
        Objects.requireNonNull(value, "Use an explicit null predicate for null values");
        return (root, query, builder) -> builder.equal(resolve(root, field), value);
    }

    public Specification<T> containsIgnoreCase(String field, String value) {
        validateField(field);
        Objects.requireNonNull(value, "Filter text is required");
        String escaped =
                value.toLowerCase(Locale.ROOT)
                        .replace("\\", "\\\\")
                        .replace("%", "\\%")
                        .replace("_", "\\_");
        return (root, query, builder) ->
                builder.like(
                        builder.lower(resolve(root, field).as(String.class)),
                        "%" + escaped + "%",
                        '\\');
    }

    private static void validateField(String field) {
        if (field == null || !field.matches("[A-Za-z][A-Za-z0-9_]*(\\.[A-Za-z][A-Za-z0-9_]*)*")) {
            throw new IllegalArgumentException("Invalid application-defined entity path");
        }
    }

    private static Path<?> resolve(Path<?> root, String field) {
        Path<?> current = root;
        for (String part : field.split("\\.")) {
            current = current.get(part);
        }
        return current;
    }
}
