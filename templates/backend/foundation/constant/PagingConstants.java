package {{package}}.constant;

/** Technical defaults for new APIs; approved resource contracts may set lower limits. */
public final class PagingConstants {
    public static final int DEFAULT_PAGE_NUMBER = 1;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 1000;
    public static final String DEFAULT_SORT_ORDER = "ASC";

    private PagingConstants() {}
}
