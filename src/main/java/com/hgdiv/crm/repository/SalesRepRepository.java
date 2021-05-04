package com.hgdiv.crm.repository;

import com.hgdiv.crm.domain.SalesRep;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SalesRep entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesRepRepository extends JpaRepository<SalesRep, Long> {}
