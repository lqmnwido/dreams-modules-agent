package {{package}}.util;

import {{package}}.constant.PagingConstants;
import {{package}}.exception.InvalidRequestException;
import {{package}}.form.SearchForm;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PagingUtil {
    private PagingUtil() {}

    /** Sort aliases and default/tie-breaker aliases must be defined by application code. */
    public static Pageable toPageable(
            SearchForm form,
            Map<String, String> allowedSorts,
            String defaultSort,
            String stableSort) {
        if (!allowedSorts.containsKey(defaultSort) || !allowedSorts.containsKey(stableSort)) {
            throw new IllegalArgumentException("Default and stable sorts must be configured");
        }
        if (form.getPageNo() < 1
                || form.getPageSize() < 1
                || form.getPageSize() > PagingConstants.MAX_PAGE_SIZE) {
            throw new InvalidRequestException("Invalid page number or page size");
        }
        String alias = form.getSortBy() == null ? defaultSort : form.getSortBy();
        String property = allowedSorts.get(alias);
        if (property == null) {
            throw new InvalidRequestException("Unsupported sort field");
        }
        String order = form.getSortOrder();
        if (order == null || !(order.equalsIgnoreCase("ASC") || order.equalsIgnoreCase("DESC"))) {
            throw new InvalidRequestException("Sort order must be ASC or DESC");
        }
        Sort.Direction direction = Sort.Direction.fromString(order);
        Sort sort = Sort.by(direction, property);
        String stableProperty = allowedSorts.get(stableSort);
        if (!stableProperty.equals(property)) {
            sort = sort.and(Sort.by(direction, stableProperty));
        }
        return PageRequest.of(form.getPageNo() - 1, form.getPageSize(), sort);
    }
}
