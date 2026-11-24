package {{package}}.form;

import java.util.List;

/** Bounded, explicitly unpaged results. Large resource lists use PageResponseForm. */
public record ListResponseForm<T>(List<T> data) {
    public ListResponseForm {
        data = List.copyOf(data);
    }
}
