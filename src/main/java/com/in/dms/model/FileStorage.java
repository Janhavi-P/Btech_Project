package com.in.dms.model;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Document")
public class FileStorage {

    @EmbeddedId
    private FileStorageKey keyid;

    @Column(name = "Doc_name")
    private String filename;

    @Lob
    @Column(name = "File_data")
    private byte[] filedata;

    @Column(name = "size")
    private Long size;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "type")
    private String type;

    // Constructors
    public FileStorage() {
        // Default no-argument constructor
    }


    public FileStorage(FileStorageKey keyid, String filename, byte[] filedata, long size, LocalDateTime timestamp,String type) {
        this.keyid = keyid;
        this.filename = filename;
        this.filedata = filedata;
        this.size = size;
        this.timestamp = timestamp;
        this.type=type;
    }

    // Getters and Setters
    public FileStorageKey getKeyId() {
        return keyid;
    }

    public void setKeyId(FileStorageKey keyid) {
        this.keyid = keyid;
    }
    //version id getters and setters

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public byte[] getFiledata() {
        return filedata;
    }

    public void setFiledata(byte[] filedata) {
        this.filedata = filedata;
    }
    // Getter for 'size'
    public long getSize() {
        return size;
    }

    // Setter for 'size'
    public void setSize(Long size) {
        this.size = size;
    }
    //
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    //
    public String getType(){return type;}
    public void setType(String type){this.type=type;}
}