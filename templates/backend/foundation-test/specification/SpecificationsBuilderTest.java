package {{package}}.specification;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;

class SpecificationsBuilderTest {
    @Test
    @SuppressWarnings("unchecked")
    void containsEscapesLiteralWildcardsAndBindsText() {
        Root<Object> root = mock(Root.class);
        Path<Object> field = mock(Path.class);
        Expression<String> text = mock(Expression.class);
        CriteriaBuilder builder = mock(CriteriaBuilder.class);
        when(root.get("name")).thenReturn(field);
        when(field.as(String.class)).thenReturn(text);
        when(builder.lower(text)).thenReturn(text);
        new SpecificationsBuilder<>()
                .containsIgnoreCase("name", "A%_\\B")
                .toPredicate(root, null, builder);
        verify(builder).like(text, "%a\\%\\_\\\\b%", '\\');
    }

    @Test
    @SuppressWarnings("unchecked")
    void equalityResolvesOnlyTheConfiguredRelationshipPath() {
        Root<Object> root = mock(Root.class);
        Path<Object> relation = mock(Path.class);
        Path<Object> id = mock(Path.class);
        CriteriaBuilder builder = mock(CriteriaBuilder.class);
        when(root.get("owner")).thenReturn(relation);
        when(relation.get("id")).thenReturn(id);
        new SpecificationsBuilder<>().equalTo("owner.id", "actor").toPredicate(root, null, builder);
        verify(builder).equal(id, "actor");
    }

    @Test
    void invalidPathsAndNullValuesFailBeforeQueryExecution() {
        SpecificationsBuilder<Object> builder = new SpecificationsBuilder<>();
        assertThatThrownBy(() -> builder.equalTo("name;drop", "x"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> builder.equalTo("owner..id", "x"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> builder.equalTo("name", null))
                .isInstanceOf(NullPointerException.class);
        assertThatThrownBy(() -> builder.containsIgnoreCase("name", null))
                .isInstanceOf(NullPointerException.class);
    }
}
