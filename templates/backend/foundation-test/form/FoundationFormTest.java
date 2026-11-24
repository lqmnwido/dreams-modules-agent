package {{package}}.form;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import {{package}}.constant.PagingConstants;
import {{package}}.exception.InvalidRequestException;
import jakarta.validation.Validation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

class FoundationFormTest {
    private static final Map<String, String> SORTS = Map.of("name", "displayName", "id", "id");

    @Test
    void defaultsAndMappingPreserveOneBasedPageEnvelope() {
        SearchForm search = new SearchForm();
        assertThat(search.toPageable(SORTS, "name", "id").getPageNumber()).isZero();
        assertThat(search.getPageSize()).isEqualTo(PagingConstants.DEFAULT_PAGE_SIZE);
        PageImpl<String> page = new PageImpl<>(List.of("entity"), PageRequest.of(1, 1), 3);
        PageResponseForm<String> response = PageResponseForm.from(page, List.of("mapped"));
        assertThat(response.data()).containsExactly("mapped");
        assertThat(response.pageNo()).isEqualTo(2);
        assertThat(response.totalItems()).isEqualTo(3);
        assertThat(response.totalPages()).isEqualTo(3);
        assertThatThrownBy(() -> PageResponseForm.from(page, List.of()))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void responseRowsAreDefensivelyCopied() {
        List<String> input = new ArrayList<>(List.of("first"));
        ListResponseForm<String> response = new ListResponseForm<>(input);
        input.clear();
        assertThat(response.data()).containsExactly("first");
        assertThatThrownBy(() -> response.data().clear())
                .isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    void invalidBoundariesFailBeanValidationAndDirectCalls() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            SearchForm search = new SearchForm();
            assertThat(factory.getValidator().validate(search)).isEmpty();
            search.setPageNo(0);
            search.setPageSize(PagingConstants.MAX_PAGE_SIZE + 1);
            search.setSortOrder("unsafe");
            assertThat(factory.getValidator().validate(search)).hasSize(3);
            assertThatThrownBy(() -> search.toPageable(SORTS, "name", "id"))
                    .isInstanceOf(InvalidRequestException.class);
        }
    }

    @Test
    void sortingUsesApplicationAliasesAndStableTieBreaker() {
        SearchForm search = new SearchForm();
        search.setSortBy("name");
        search.setSortOrder("desc");
        assertThat(search.toPageable(SORTS, "name", "id").getSort())
                .isEqualTo(Sort.by(Sort.Direction.DESC, "displayName", "id"));
        search.setSortBy("id");
        assertThat(search.toPageable(SORTS, "name", "id").getSort().stream().count()).isEqualTo(1);
        search.setSortBy("owner.password");
        assertThatThrownBy(() -> search.toPageable(SORTS, "name", "id"))
                .isInstanceOf(InvalidRequestException.class);
        search.setSortBy(null);
        search.setSortOrder(null);
        assertThatThrownBy(() -> search.toPageable(SORTS, "name", "id"))
                .isInstanceOf(InvalidRequestException.class);
        assertThatThrownBy(() -> search.toPageable(SORTS, "unknown", "id"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void acceptsMaximumPageSizeAndRejectsNegativeOrZeroInputs() {
        SearchForm search = new SearchForm();
        search.setPageSize(PagingConstants.MAX_PAGE_SIZE);
        assertThat(search.toPageable(SORTS, "id", "id").getPageSize())
                .isEqualTo(PagingConstants.MAX_PAGE_SIZE);
        search.setPageSize(0);
        assertThatThrownBy(() -> search.toPageable(SORTS, "id", "id"))
                .isInstanceOf(InvalidRequestException.class);
        search.setPageSize(1);
        search.setPageNo(-1);
        assertThatThrownBy(() -> search.toPageable(SORTS, "id", "id"))
                .isInstanceOf(InvalidRequestException.class);
    }
}
