package com.in.dms.model;
import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


import java.io.Serializable;

@Embeddable
public class FileStorageKey implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Document_id")
    private Long Doc_id;


    @Column(name = "Version_id")
    private Integer Version_id;
    public FileStorageKey() {
        // Default no-argument constructor
    }

    public FileStorageKey(Long id, Integer Version_id) {
        this.Doc_id = id;
        this.Version_id = Version_id;
    }


    // Constructors, getters, and setters for this class
    public Long getId() {
        return Doc_id;
    }

    public void setId(Long Doc_id) {
        this.Doc_id = Doc_id;
    }
    public Integer getVersion_id() {
        return Version_id;
    }

    public void setVersion_id(Integer Version_id) {
        this.Version_id = Version_id;
    }

}