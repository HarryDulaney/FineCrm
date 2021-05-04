package com.hgdiv.crm.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hgdiv.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContactCategory.class);
        ContactCategory contactCategory1 = new ContactCategory();
        contactCategory1.setId(1L);
        ContactCategory contactCategory2 = new ContactCategory();
        contactCategory2.setId(contactCategory1.getId());
        assertThat(contactCategory1).isEqualTo(contactCategory2);
        contactCategory2.setId(2L);
        assertThat(contactCategory1).isNotEqualTo(contactCategory2);
        contactCategory1.setId(null);
        assertThat(contactCategory1).isNotEqualTo(contactCategory2);
    }
}
