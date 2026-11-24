package {{package}}.form;

import java.util.List;
import org.springframework.data.domain.Page;

/** One-based API page metadata and mapped response rows; never serialize entity graphs. */
public record PageResponseForm<T>(List<T> data, int pageNo, long totalItems, int totalPages) {
    public PageResponseForm {
        data = List.copyOf(data);
    }

    public static <E, T> PageResponseForm<T> from(Page<E> page, List<T> mappedRows) {
        if (!page.getPageable().isPaged()) {
            throw new IllegalArgumentException("A paged result is required");
        }
        if (mappedRows.size() != page.getNumberOfElements()) {
            throw new IllegalArgumentException("Map every row in the requested page");
        }
        return new PageResponseForm<>(
                mappedRows, page.getNumber() + 1, page.getTotalElements(), page.getTotalPages());
    }
}
