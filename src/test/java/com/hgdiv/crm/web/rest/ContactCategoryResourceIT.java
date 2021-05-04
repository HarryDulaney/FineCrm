package com.hgdiv.crm.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hgdiv.crm.IntegrationTest;
import com.hgdiv.crm.domain.ContactCategory;
import com.hgdiv.crm.repository.ContactCategoryRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ContactCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContactCategoryResourceIT {

    private static final String DEFAULT_CATEGORY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/contact-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContactCategoryRepository contactCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContactCategoryMockMvc;

    private ContactCategory contactCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactCategory createEntity(EntityManager em) {
        ContactCategory contactCategory = new ContactCategory().categoryName(DEFAULT_CATEGORY_NAME);
        return contactCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactCategory createUpdatedEntity(EntityManager em) {
        ContactCategory contactCategory = new ContactCategory().categoryName(UPDATED_CATEGORY_NAME);
        return contactCategory;
    }

    @BeforeEach
    public void initTest() {
        contactCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createContactCategory() throws Exception {
        int databaseSizeBeforeCreate = contactCategoryRepository.findAll().size();
        // Create the ContactCategory
        restContactCategoryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isCreated());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        ContactCategory testContactCategory = contactCategoryList.get(contactCategoryList.size() - 1);
        assertThat(testContactCategory.getCategoryName()).isEqualTo(DEFAULT_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void createContactCategoryWithExistingId() throws Exception {
        // Create the ContactCategory with an existing ID
        contactCategory.setId(1L);

        int databaseSizeBeforeCreate = contactCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContactCategoryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCategoryNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = contactCategoryRepository.findAll().size();
        // set the field null
        contactCategory.setCategoryName(null);

        // Create the ContactCategory, which fails.

        restContactCategoryMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContactCategories() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        // Get all the contactCategoryList
        restContactCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contactCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].categoryName").value(hasItem(DEFAULT_CATEGORY_NAME)));
    }

    @Test
    @Transactional
    void getContactCategory() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        // Get the contactCategory
        restContactCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, contactCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contactCategory.getId().intValue()))
            .andExpect(jsonPath("$.categoryName").value(DEFAULT_CATEGORY_NAME));
    }

    @Test
    @Transactional
    void getNonExistingContactCategory() throws Exception {
        // Get the contactCategory
        restContactCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewContactCategory() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();

        // Update the contactCategory
        ContactCategory updatedContactCategory = contactCategoryRepository.findById(contactCategory.getId()).get();
        // Disconnect from session so that the updates on updatedContactCategory are not directly saved in db
        em.detach(updatedContactCategory);
        updatedContactCategory.categoryName(UPDATED_CATEGORY_NAME);

        restContactCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedContactCategory.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedContactCategory))
            )
            .andExpect(status().isOk());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
        ContactCategory testContactCategory = contactCategoryList.get(contactCategoryList.size() - 1);
        assertThat(testContactCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void putNonExistingContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contactCategory.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContactCategoryWithPatch() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();

        // Update the contactCategory using partial update
        ContactCategory partialUpdatedContactCategory = new ContactCategory();
        partialUpdatedContactCategory.setId(contactCategory.getId());

        restContactCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactCategory.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContactCategory))
            )
            .andExpect(status().isOk());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
        ContactCategory testContactCategory = contactCategoryList.get(contactCategoryList.size() - 1);
        assertThat(testContactCategory.getCategoryName()).isEqualTo(DEFAULT_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void fullUpdateContactCategoryWithPatch() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();

        // Update the contactCategory using partial update
        ContactCategory partialUpdatedContactCategory = new ContactCategory();
        partialUpdatedContactCategory.setId(contactCategory.getId());

        partialUpdatedContactCategory.categoryName(UPDATED_CATEGORY_NAME);

        restContactCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactCategory.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContactCategory))
            )
            .andExpect(status().isOk());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
        ContactCategory testContactCategory = contactCategoryList.get(contactCategoryList.size() - 1);
        assertThat(testContactCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contactCategory.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContactCategory() throws Exception {
        int databaseSizeBeforeUpdate = contactCategoryRepository.findAll().size();
        contactCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contactCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactCategory in the database
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContactCategory() throws Exception {
        // Initialize the database
        contactCategoryRepository.saveAndFlush(contactCategory);

        int databaseSizeBeforeDelete = contactCategoryRepository.findAll().size();

        // Delete the contactCategory
        restContactCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, contactCategory.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ContactCategory> contactCategoryList = contactCategoryRepository.findAll();
        assertThat(contactCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
