package com.hgdiv.crm.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hgdiv.crm.IntegrationTest;
import com.hgdiv.crm.domain.SalesRep;
import com.hgdiv.crm.repository.SalesRepRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link SalesRepResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalesRepResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Double DEFAULT_GENERATED_REVENUE = 1D;
    private static final Double UPDATED_GENERATED_REVENUE = 2D;

    private static final Double DEFAULT_COMMISSION_OWED = 1D;
    private static final Double UPDATED_COMMISSION_OWED = 2D;

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_REGION = "AAAAAAAAAA";
    private static final String UPDATED_REGION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sales-reps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalesRepRepository salesRepRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesRepMockMvc;

    private SalesRep salesRep;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesRep createEntity(EntityManager em) {
        SalesRep salesRep = new SalesRep()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .generatedRevenue(DEFAULT_GENERATED_REVENUE)
            .commissionOwed(DEFAULT_COMMISSION_OWED)
            .startDate(DEFAULT_START_DATE)
            .region(DEFAULT_REGION);
        return salesRep;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesRep createUpdatedEntity(EntityManager em) {
        SalesRep salesRep = new SalesRep()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .generatedRevenue(UPDATED_GENERATED_REVENUE)
            .commissionOwed(UPDATED_COMMISSION_OWED)
            .startDate(UPDATED_START_DATE)
            .region(UPDATED_REGION);
        return salesRep;
    }

    @BeforeEach
    public void initTest() {
        salesRep = createEntity(em);
    }

    @Test
    @Transactional
    void createSalesRep() throws Exception {
        int databaseSizeBeforeCreate = salesRepRepository.findAll().size();
        // Create the SalesRep
        restSalesRepMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isCreated());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeCreate + 1);
        SalesRep testSalesRep = salesRepList.get(salesRepList.size() - 1);
        assertThat(testSalesRep.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testSalesRep.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testSalesRep.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSalesRep.getGeneratedRevenue()).isEqualTo(DEFAULT_GENERATED_REVENUE);
        assertThat(testSalesRep.getCommissionOwed()).isEqualTo(DEFAULT_COMMISSION_OWED);
        assertThat(testSalesRep.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testSalesRep.getRegion()).isEqualTo(DEFAULT_REGION);
    }

    @Test
    @Transactional
    void createSalesRepWithExistingId() throws Exception {
        // Create the SalesRep with an existing ID
        salesRep.setId(1L);

        int databaseSizeBeforeCreate = salesRepRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesRepMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = salesRepRepository.findAll().size();
        // set the field null
        salesRep.setFirstName(null);

        // Create the SalesRep, which fails.

        restSalesRepMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = salesRepRepository.findAll().size();
        // set the field null
        salesRep.setLastName(null);

        // Create the SalesRep, which fails.

        restSalesRepMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = salesRepRepository.findAll().size();
        // set the field null
        salesRep.setEmail(null);

        // Create the SalesRep, which fails.

        restSalesRepMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSalesReps() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        // Get all the salesRepList
        restSalesRepMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesRep.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].generatedRevenue").value(hasItem(DEFAULT_GENERATED_REVENUE.doubleValue())))
            .andExpect(jsonPath("$.[*].commissionOwed").value(hasItem(DEFAULT_COMMISSION_OWED.doubleValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION)));
    }

    @Test
    @Transactional
    void getSalesRep() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        // Get the salesRep
        restSalesRepMockMvc
            .perform(get(ENTITY_API_URL_ID, salesRep.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salesRep.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.generatedRevenue").value(DEFAULT_GENERATED_REVENUE.doubleValue()))
            .andExpect(jsonPath("$.commissionOwed").value(DEFAULT_COMMISSION_OWED.doubleValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.region").value(DEFAULT_REGION));
    }

    @Test
    @Transactional
    void getNonExistingSalesRep() throws Exception {
        // Get the salesRep
        restSalesRepMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSalesRep() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();

        // Update the salesRep
        SalesRep updatedSalesRep = salesRepRepository.findById(salesRep.getId()).get();
        // Disconnect from session so that the updates on updatedSalesRep are not directly saved in db
        em.detach(updatedSalesRep);
        updatedSalesRep
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .generatedRevenue(UPDATED_GENERATED_REVENUE)
            .commissionOwed(UPDATED_COMMISSION_OWED)
            .startDate(UPDATED_START_DATE)
            .region(UPDATED_REGION);

        restSalesRepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalesRep.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalesRep))
            )
            .andExpect(status().isOk());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
        SalesRep testSalesRep = salesRepList.get(salesRepList.size() - 1);
        assertThat(testSalesRep.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSalesRep.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSalesRep.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSalesRep.getGeneratedRevenue()).isEqualTo(UPDATED_GENERATED_REVENUE);
        assertThat(testSalesRep.getCommissionOwed()).isEqualTo(UPDATED_COMMISSION_OWED);
        assertThat(testSalesRep.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSalesRep.getRegion()).isEqualTo(UPDATED_REGION);
    }

    @Test
    @Transactional
    void putNonExistingSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salesRep.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalesRepWithPatch() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();

        // Update the salesRep using partial update
        SalesRep partialUpdatedSalesRep = new SalesRep();
        partialUpdatedSalesRep.setId(salesRep.getId());

        partialUpdatedSalesRep.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).region(UPDATED_REGION);

        restSalesRepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesRep.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesRep))
            )
            .andExpect(status().isOk());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
        SalesRep testSalesRep = salesRepList.get(salesRepList.size() - 1);
        assertThat(testSalesRep.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSalesRep.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSalesRep.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSalesRep.getGeneratedRevenue()).isEqualTo(DEFAULT_GENERATED_REVENUE);
        assertThat(testSalesRep.getCommissionOwed()).isEqualTo(DEFAULT_COMMISSION_OWED);
        assertThat(testSalesRep.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testSalesRep.getRegion()).isEqualTo(UPDATED_REGION);
    }

    @Test
    @Transactional
    void fullUpdateSalesRepWithPatch() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();

        // Update the salesRep using partial update
        SalesRep partialUpdatedSalesRep = new SalesRep();
        partialUpdatedSalesRep.setId(salesRep.getId());

        partialUpdatedSalesRep
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .generatedRevenue(UPDATED_GENERATED_REVENUE)
            .commissionOwed(UPDATED_COMMISSION_OWED)
            .startDate(UPDATED_START_DATE)
            .region(UPDATED_REGION);

        restSalesRepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesRep.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesRep))
            )
            .andExpect(status().isOk());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
        SalesRep testSalesRep = salesRepList.get(salesRepList.size() - 1);
        assertThat(testSalesRep.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSalesRep.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSalesRep.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSalesRep.getGeneratedRevenue()).isEqualTo(UPDATED_GENERATED_REVENUE);
        assertThat(testSalesRep.getCommissionOwed()).isEqualTo(UPDATED_COMMISSION_OWED);
        assertThat(testSalesRep.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSalesRep.getRegion()).isEqualTo(UPDATED_REGION);
    }

    @Test
    @Transactional
    void patchNonExistingSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salesRep.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalesRep() throws Exception {
        int databaseSizeBeforeUpdate = salesRepRepository.findAll().size();
        salesRep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesRepMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesRep))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesRep in the database
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalesRep() throws Exception {
        // Initialize the database
        salesRepRepository.saveAndFlush(salesRep);

        int databaseSizeBeforeDelete = salesRepRepository.findAll().size();

        // Delete the salesRep
        restSalesRepMockMvc
            .perform(delete(ENTITY_API_URL_ID, salesRep.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SalesRep> salesRepList = salesRepRepository.findAll();
        assertThat(salesRepList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
