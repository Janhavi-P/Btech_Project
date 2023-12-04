package com.in.dms.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;


import java.time.LocalDateTime;

@Entity
@Table(name="Document")
public class Folder {

    @EmbeddedId
    private FileStorageKey keyid;
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "Document_id")
//    private Integer folderid;

    @Column(name = "folder_name")
    private String parentFolderName;      //name of the folders in which files are stored



    @Column(name = "timestamp")
    private LocalDateTime created_on;
    @Column(name = "emp_id")
    private Integer employeeId;


    @Column(name = "Doc_name")
    private String filename;        //name of newly created folder

    @Column(name = "type")
    private String file_Type;

    public Folder(    FileStorageKey keyid,String parentFolderName, Integer employeeId, LocalDateTime created_on,String filename,String file_Type) {
        this.keyid = keyid;
       // this.folderid=folderid;
        this.parentFolderName = parentFolderName;
        this.employeeId = employeeId;
        this.filename=filename;
        this.file_Type=file_Type;
        this.created_on=created_on;
    }
    public Folder() {

    }

    public FileStorageKey getKeyId() {
        return keyid;
    }

    public void setKeyId(FileStorageKey keyid) {
        this.keyid = keyid;
    }
    public Integer getEmployeeid() {
        return employeeId;
    }

    public void setEmployeeid(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getFilename() {
        return filename;
    }
    public void setFileName(String filename) {
        this.filename = filename;
    }
    public String getFolderName() {
        return parentFolderName;
    }
    public void setFolderName(String parentFolderName) {
        this.parentFolderName = parentFolderName;
    }

    public void setFileType(String file_Type) {
        this.file_Type = file_Type;
    }
    public String getFileType() {
        return file_Type;
    }




    public LocalDateTime getCreatedTime() {
        return created_on;
    }

    public void setCreatedTime(LocalDateTime created_on) {
        this.created_on = created_on;
    }
//    public Integer getId() {
//        return folderid;
//    }
//
//    public void setId(Integer folderid) {
//        this.folderid = folderid;
//    }
}