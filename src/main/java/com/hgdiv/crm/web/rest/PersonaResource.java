package com.hgdiv.crm.web.rest;

import com.hgdiv.crm.domain.Persona;
import com.hgdiv.crm.repository.PersonaRepository;
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
 * REST controller for managing {@link com.hgdiv.crm.domain.Persona}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PersonaResource {

    private final Logger log = LoggerFactory.getLogger(PersonaResource.class);

    private static final String ENTITY_NAME = "persona";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonaRepository personaRepository;

    public PersonaResource(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    /**
     * {@code POST  /personas} : Create a new persona.
     *
     * @param persona the persona to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new persona, or with status {@code 400 (Bad Request)} if the persona has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/personas")
    public ResponseEntity<Persona> createPersona(@Valid @RequestBody Persona persona) throws URISyntaxException {
        log.debug("REST request to save Persona : {}", persona);
        if (persona.getId() != null) {
            throw new BadRequestAlertException("A new persona cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Persona result = personaRepository.save(persona);
        return ResponseEntity
            .created(new URI("/api/personas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /personas/:id} : Updates an existing persona.
     *
     * @param id the id of the persona to save.
     * @param persona the persona to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated persona,
     * or with status {@code 400 (Bad Request)} if the persona is not valid,
     * or with status {@code 500 (Internal Server Error)} if the persona couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/personas/{id}")
    public ResponseEntity<Persona> updatePersona(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Persona persona
    ) throws URISyntaxException {
        log.debug("REST request to update Persona : {}, {}", id, persona);
        if (persona.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, persona.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Persona result = personaRepository.save(persona);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, persona.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /personas/:id} : Partial updates given fields of an existing persona, field will ignore if it is null
     *
     * @param id the id of the persona to save.
     * @param persona the persona to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated persona,
     * or with status {@code 400 (Bad Request)} if the persona is not valid,
     * or with status {@code 404 (Not Found)} if the persona is not found,
     * or with status {@code 500 (Internal Server Error)} if the persona couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/personas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Persona> partialUpdatePersona(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Persona persona
    ) throws URISyntaxException {
        log.debug("REST request to partial update Persona partially : {}, {}", id, persona);
        if (persona.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, persona.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Persona> result = personaRepository
            .findById(persona.getId())
            .map(
                existingPersona -> {
                    if (persona.getName() != null) {
                        existingPersona.setName(persona.getName());
                    }
                    if (persona.getProfile() != null) {
                        existingPersona.setProfile(persona.getProfile());
                    }

                    return existingPersona;
                }
            )
            .map(personaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, persona.getId().toString())
        );
    }

    /**
     * {@code GET  /personas} : get all the personas.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personas in body.
     */
    @GetMapping("/personas")
    public List<Persona> getAllPersonas(@RequestParam(required = false) String filter) {
        if ("contact-is-null".equals(filter)) {
            log.debug("REST request to get all Personas where contact is null");
            return StreamSupport
                .stream(personaRepository.findAll().spliterator(), false)
                .filter(persona -> persona.getContact() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Personas");
        return personaRepository.findAll();
    }

    /**
     * {@code GET  /personas/:id} : get the "id" persona.
     *
     * @param id the id of the persona to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the persona, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/personas/{id}")
    public ResponseEntity<Persona> getPersona(@PathVariable Long id) {
        log.debug("REST request to get Persona : {}", id);
        Optional<Persona> persona = personaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(persona);
    }

    /**
     * {@code DELETE  /personas/:id} : delete the "id" persona.
     *
     * @param id the id of the persona to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/personas/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Long id) {
        log.debug("REST request to delete Persona : {}", id);
        personaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
