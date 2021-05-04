package com.hgdiv.crm.web.rest;

import com.hgdiv.crm.domain.ContactCategory;
import com.hgdiv.crm.repository.ContactCategoryRepository;
import com.hgdiv.crm.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.hgdiv.crm.domain.ContactCategory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContactCategoryResource {

    private final Logger log = LoggerFactory.getLogger(ContactCategoryResource.class);

    private static final String ENTITY_NAME = "contactCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContactCategoryRepository contactCategoryRepository;

    public ContactCategoryResource(ContactCategoryRepository contactCategoryRepository) {
        this.contactCategoryRepository = contactCategoryRepository;
    }

    /**
     * {@code POST  /contact-categories} : Create a new contactCategory.
     *
     * @param contactCategory the contactCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contactCategory, or with status {@code 400 (Bad Request)} if the contactCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contact-categories")
    public ResponseEntity<ContactCategory> createContactCategory(@Valid @RequestBody ContactCategory contactCategory)
        throws URISyntaxException {
        log.debug("REST request to save ContactCategory : {}", contactCategory);
        if (contactCategory.getId() != null) {
            throw new BadRequestAlertException("A new contactCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ContactCategory result = contactCategoryRepository.save(contactCategory);
        return ResponseEntity
            .created(new URI("/api/contact-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contact-categories/:id} : Updates an existing contactCategory.
     *
     * @param id the id of the contactCategory to save.
     * @param contactCategory the contactCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactCategory,
     * or with status {@code 400 (Bad Request)} if the contactCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contactCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contact-categories/{id}")
    public ResponseEntity<ContactCategory> updateContactCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ContactCategory contactCategory
    ) throws URISyntaxException {
        log.debug("REST request to update ContactCategory : {}, {}", id, contactCategory);
        if (contactCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ContactCategory result = contactCategoryRepository.save(contactCategory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactCategory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contact-categories/:id} : Partial updates given fields of an existing contactCategory, field will ignore if it is null
     *
     * @param id the id of the contactCategory to save.
     * @param contactCategory the contactCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactCategory,
     * or with status {@code 400 (Bad Request)} if the contactCategory is not valid,
     * or with status {@code 404 (Not Found)} if the contactCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the contactCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contact-categories/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ContactCategory> partialUpdateContactCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ContactCategory contactCategory
    ) throws URISyntaxException {
        log.debug("REST request to partial update ContactCategory partially : {}, {}", id, contactCategory);
        if (contactCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ContactCategory> result = contactCategoryRepository
            .findById(contactCategory.getId())
            .map(
                existingContactCategory -> {
                    if (contactCategory.getCategoryName() != null) {
                        existingContactCategory.setCategoryName(contactCategory.getCategoryName());
                    }

                    return existingContactCategory;
                }
            )
            .map(contactCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /contact-categories} : get all the contactCategories.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contactCategories in body.
     */
    @GetMapping("/contact-categories")
    public List<ContactCategory> getAllContactCategories(@RequestParam(required = false) String filter) {
        if ("contact-is-null".equals(filter)) {
            log.debug("REST request to get all ContactCategorys where contact is null");
            return StreamSupport
                .stream(contactCategoryRepository.findAll().spliterator(), false)
                .filter(contactCategory -> contactCategory.getContact() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all ContactCategories");
        return contactCategoryRepository.findAll();
    }

    /**
     * {@code GET  /contact-categories/:id} : get the "id" contactCategory.
     *
     * @param id the id of the contactCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contactCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contact-categories/{id}")
    public ResponseEntity<ContactCategory> getContactCategory(@PathVariable Long id) {
        log.debug("REST request to get ContactCategory : {}", id);
        Optional<ContactCategory> contactCategory = contactCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contactCategory);
    }

    /**
     * {@code DELETE  /contact-categories/:id} : delete the "id" contactCategory.
     *
     * @param id the id of the contactCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contact-categories/{id}")
    public ResponseEntity<Void> deleteContactCategory(@PathVariable Long id) {
        log.debug("REST request to delete ContactCategory : {}", id);
        contactCategoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
