package com.hgdiv.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A SalesRep.
 */
@Entity
@Table(name = "sales_rep")
public class SalesRep implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "generated_revenue")
    private Double generatedRevenue;

    @Column(name = "commission_owed")
    private Double commissionOwed;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "region")
    private String region;

    @OneToMany(mappedBy = "salesRep")
    @JsonIgnoreProperties(value = { "contactCategory", "persona", "salesRep", "company" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SalesRep id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public SalesRep firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public SalesRep lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public SalesRep email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getGeneratedRevenue() {
        return this.generatedRevenue;
    }

    public SalesRep generatedRevenue(Double generatedRevenue) {
        this.generatedRevenue = generatedRevenue;
        return this;
    }

    public void setGeneratedRevenue(Double generatedRevenue) {
        this.generatedRevenue = generatedRevenue;
    }

    public Double getCommissionOwed() {
        return this.commissionOwed;
    }

    public SalesRep commissionOwed(Double commissionOwed) {
        this.commissionOwed = commissionOwed;
        return this;
    }

    public void setCommissionOwed(Double commissionOwed) {
        this.commissionOwed = commissionOwed;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public SalesRep startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getRegion() {
        return this.region;
    }

    public SalesRep region(String region) {
        this.region = region;
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public SalesRep contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public SalesRep addContact(Contact contact) {
        this.contacts.add(contact);
        contact.setSalesRep(this);
        return this;
    }

    public SalesRep removeContact(Contact contact) {
        this.contacts.remove(contact);
        contact.setSalesRep(null);
        return this;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setSalesRep(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setSalesRep(this));
        }
        this.contacts = contacts;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SalesRep)) {
            return false;
        }
        return id != null && id.equals(((SalesRep) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalesRep{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", generatedRevenue=" + getGeneratedRevenue() +
            ", commissionOwed=" + getCommissionOwed() +
            ", startDate='" + getStartDate() + "'" +
            ", region='" + getRegion() + "'" +
            "}";
    }
}
