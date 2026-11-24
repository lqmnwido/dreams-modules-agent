package {{package}}.form;

import {{package}}.constant.PagingConstants;
import {{package}}.util.PagingUtil;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.data.domain.Pageable;

/** Extend per resource with its real filters. No shared business fields or fetch-all switch. */
public class SearchForm {
    @Min(1)
    private int pageNo = PagingConstants.DEFAULT_PAGE_NUMBER;

    @Min(1)
    @Max(PagingConstants.MAX_PAGE_SIZE)
    private int pageSize = PagingConstants.DEFAULT_PAGE_SIZE;

    @Size(max = 100)
    private String sortBy;

    @NotBlank
    @Pattern(regexp = "(?i)ASC|DESC")
    private String sortOrder = PagingConstants.DEFAULT_SORT_ORDER;

    public Pageable toPageable(
            Map<String, String> allowedSorts, String defaultSort, String stableSort) {
        return PagingUtil.toPageable(this, allowedSorts, defaultSort, stableSort);
    }

    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }
}
