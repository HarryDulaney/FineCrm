package com.hgdiv.crm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hgdiv.crm.domain.enumeration.Language;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * The Contact entity.
 */
@ApiModel(description = "The Contact entity.")
@Entity
@Table(name = "contact")
public class Contact implements Serializable {

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

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "linked_in_profile")
    private String linkedInProfile;

    @Column(name = "mailing_address")
    private String mailingAddress;

    @Column(name = "connect_date")
    private LocalDate connectDate;

    @Column(name = "job_title")
    private String jobTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Language language;

    @Column(name = "vip")
    private Boolean vip;

    @Column(name = "affiliate")
    private Boolean affiliate;

    @Column(name = "zip_code")
    private Integer zipCode;

    @JsonIgnoreProperties(value = { "contact" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ContactCategory contactCategory;

    @JsonIgnoreProperties(value = { "contact" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Persona persona;

    @ManyToOne
    @JsonIgnoreProperties(value = { "contacts" }, allowSetters = true)
    private SalesRep salesRep;

    @ManyToOne
    @JsonIgnoreProperties(value = { "contacts" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Contact id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Contact firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Contact lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Contact email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Contact phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getLinkedInProfile() {
        return this.linkedInProfile;
    }

    public Contact linkedInProfile(String linkedInProfile) {
        this.linkedInProfile = linkedInProfile;
        return this;
    }

    public void setLinkedInProfile(String linkedInProfile) {
        this.linkedInProfile = linkedInProfile;
    }

    public String getMailingAddress() {
        return this.mailingAddress;
    }

    public Contact mailingAddress(String mailingAddress) {
        this.mailingAddress = mailingAddress;
        return this;
    }

    public void setMailingAddress(String mailingAddress) {
        this.mailingAddress = mailingAddress;
    }

    public LocalDate getConnectDate() {
        return this.connectDate;
    }

    public Contact connectDate(LocalDate connectDate) {
        this.connectDate = connectDate;
        return this;
    }

    public void setConnectDate(LocalDate connectDate) {
        this.connectDate = connectDate;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public Contact jobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Contact language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Boolean getVip() {
        return this.vip;
    }

    public Contact vip(Boolean vip) {
        this.vip = vip;
        return this;
    }

    public void setVip(Boolean vip) {
        this.vip = vip;
    }

    public Boolean getAffiliate() {
        return this.affiliate;
    }

    public Contact affiliate(Boolean affiliate) {
        this.affiliate = affiliate;
        return this;
    }

    public void setAffiliate(Boolean affiliate) {
        this.affiliate = affiliate;
    }

    public Integer getZipCode() {
        return this.zipCode;
    }

    public Contact zipCode(Integer zipCode) {
        this.zipCode = zipCode;
        return this;
    }

    public void setZipCode(Integer zipCode) {
        this.zipCode = zipCode;
    }

    public ContactCategory getContactCategory() {
        return this.contactCategory;
    }

    public Contact contactCategory(ContactCategory contactCategory) {
        this.setContactCategory(contactCategory);
        return this;
    }

    public void setContactCategory(ContactCategory contactCategory) {
        this.contactCategory = contactCategory;
    }

    public Persona getPersona() {
        return this.persona;
    }

    public Contact persona(Persona persona) {
        this.setPersona(persona);
        return this;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public SalesRep getSalesRep() {
        return this.salesRep;
    }

    public Contact salesRep(SalesRep salesRep) {
        this.setSalesRep(salesRep);
        return this;
    }

    public void setSalesRep(SalesRep salesRep) {
        this.salesRep = salesRep;
    }

    public Company getCompany() {
        return this.company;
    }

    public Contact company(Company company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contact)) {
            return false;
        }
        return id != null && id.equals(((Contact) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contact{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", linkedInProfile='" + getLinkedInProfile() + "'" +
            ", mailingAddress='" + getMailingAddress() + "'" +
            ", connectDate='" + getConnectDate() + "'" +
            ", jobTitle='" + getJobTitle() + "'" +
            ", language='" + getLanguage() + "'" +
            ", vip='" + getVip() + "'" +
            ", affiliate='" + getAffiliate() + "'" +
            ", zipCode=" + getZipCode() +
            "}";
    }
}
