package com.hgdiv.crm.repository;

import com.hgdiv.crm.domain.ContactCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ContactCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactCategoryRepository extends JpaRepository<ContactCategory, Long> {}
