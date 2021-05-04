package com.hgdiv.crm.web.rest;

import com.hgdiv.crm.domain.SalesRep;
import com.hgdiv.crm.repository.SalesRepRepository;
import com.hgdiv.crm.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hgdiv.crm.domain.SalesRep}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalesRepResource {

    private final Logger log = LoggerFactory.getLogger(SalesRepResource.class);

    private static final String ENTITY_NAME = "salesRep";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesRepRepository salesRepRepository;

    public SalesRepResource(SalesRepRepository salesRepRepository) {
        this.salesRepRepository = salesRepRepository;
    }

    /**
     * {@code POST  /sales-reps} : Create a new salesRep.
     *
     * @param salesRep the salesRep to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new salesRep, or with status {@code 400 (Bad Request)} if the salesRep has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales-reps")
    public ResponseEntity<SalesRep> createSalesRep(@Valid @RequestBody SalesRep salesRep) throws URISyntaxException {
        log.debug("REST request to save SalesRep : {}", salesRep);
        if (salesRep.getId() != null) {
            throw new BadRequestAlertException("A new salesRep cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalesRep result = salesRepRepository.save(salesRep);
        return ResponseEntity
            .created(new URI("/api/sales-reps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales-reps/:id} : Updates an existing salesRep.
     *
     * @param id the id of the salesRep to save.
     * @param salesRep the salesRep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesRep,
     * or with status {@code 400 (Bad Request)} if the salesRep is not valid,
     * or with status {@code 500 (Internal Server Error)} if the salesRep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales-reps/{id}")
    public ResponseEntity<SalesRep> updateSalesRep(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SalesRep salesRep
    ) throws URISyntaxException {
        log.debug("REST request to update SalesRep : {}, {}", id, salesRep);
        if (salesRep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesRep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesRepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SalesRep result = salesRepRepository.save(salesRep);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesRep.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sales-reps/:id} : Partial updates given fields of an existing salesRep, field will ignore if it is null
     *
     * @param id the id of the salesRep to save.
     * @param salesRep the salesRep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesRep,
     * or with status {@code 400 (Bad Request)} if the salesRep is not valid,
     * or with status {@code 404 (Not Found)} if the salesRep is not found,
     * or with status {@code 500 (Internal Server Error)} if the salesRep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sales-reps/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SalesRep> partialUpdateSalesRep(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SalesRep salesRep
    ) throws URISyntaxException {
        log.debug("REST request to partial update SalesRep partially : {}, {}", id, salesRep);
        if (salesRep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesRep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesRepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SalesRep> result = salesRepRepository
            .findById(salesRep.getId())
            .map(
                existingSalesRep -> {
                    if (salesRep.getFirstName() != null) {
                        existingSalesRep.setFirstName(salesRep.getFirstName());
                    }
                    if (salesRep.getLastName() != null) {
                        existingSalesRep.setLastName(salesRep.getLastName());
                    }
                    if (salesRep.getEmail() != null) {
                        existingSalesRep.setEmail(salesRep.getEmail());
                    }
                    if (salesRep.getGeneratedRevenue() != null) {
                        existingSalesRep.setGeneratedRevenue(salesRep.getGeneratedRevenue());
                    }
                    if (salesRep.getCommissionOwed() != null) {
                        existingSalesRep.setCommissionOwed(salesRep.getCommissionOwed());
                    }
                    if (salesRep.getStartDate() != null) {
                        existingSalesRep.setStartDate(salesRep.getStartDate());
                    }
                    if (salesRep.getRegion() != null) {
                        existingSalesRep.setRegion(salesRep.getRegion());
                    }

                    return existingSalesRep;
                }
            )
            .map(salesRepRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesRep.getId().toString())
        );
    }

    /**
     * {@code GET  /sales-reps} : get all the salesReps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of salesReps in body.
     */
    @GetMapping("/sales-reps")
    public List<SalesRep> getAllSalesReps() {
        log.debug("REST request to get all SalesReps");
        return salesRepRepository.findAll();
    }

    /**
     * {@code GET  /sales-reps/:id} : get the "id" salesRep.
     *
     * @param id the id of the salesRep to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the salesRep, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales-reps/{id}")
    public ResponseEntity<SalesRep> getSalesRep(@PathVariable Long id) {
        log.debug("REST request to get SalesRep : {}", id);
        Optional<SalesRep> salesRep = salesRepRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(salesRep);
    }

    /**
     * {@code DELETE  /sales-reps/:id} : delete the "id" salesRep.
     *
     * @param id the id of the salesRep to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales-reps/{id}")
    public ResponseEntity<Void> deleteSalesRep(@PathVariable Long id) {
        log.debug("REST request to delete SalesRep : {}", id);
        salesRepRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
