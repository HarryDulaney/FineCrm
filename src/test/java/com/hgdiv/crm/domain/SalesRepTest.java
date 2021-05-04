package com.hgdiv.crm.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hgdiv.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SalesRepTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalesRep.class);
        SalesRep salesRep1 = new SalesRep();
        salesRep1.setId(1L);
        SalesRep salesRep2 = new SalesRep();
        salesRep2.setId(salesRep1.getId());
        assertThat(salesRep1).isEqualTo(salesRep2);
        salesRep2.setId(2L);
        assertThat(salesRep1).isNotEqualTo(salesRep2);
        salesRep1.setId(null);
        assertThat(salesRep1).isNotEqualTo(salesRep2);
    }
}
