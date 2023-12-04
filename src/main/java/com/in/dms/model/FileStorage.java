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


    @Column(name = "emp_id")
    private Integer EmployeeID;

//    @Column(name = "Employee_id", insertable = false, updatable = false)
//    private Integer employee_id;

    @Lob
    @Column(name = "File_data")
    private byte[] filedata;

    @Column(name = "size")
    private Long size;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "type")
    private String type;

    @Column(name = "file_type")
    private String file_folder;

    @Column(name = "folder_name")
    private String foldername;

    // Constructors
    public FileStorage() {
        // Default no-argument constructor
    }


    public FileStorage(FileStorageKey keyid, String filename, byte[] filedata, long size, LocalDateTime timestamp, String type,Integer EmployeeID,String file_folder,String foldername) {
        this.keyid = keyid;
        this.filename = filename;
        this.filedata = filedata;
        this.size = size;
        this.timestamp = timestamp;
        this.type=type;
        this.EmployeeID=EmployeeID;
        this.file_folder=file_folder;
        this.foldername=foldername;
    }

    // Getters and Setters
    public Integer getEmployeeId() {
        return EmployeeID;
    }

    public void setEmployeeId(Integer EmployeeID) {
        this.EmployeeID = EmployeeID;
    }
    public FileStorageKey getKeyId() {
        return keyid;
    }

    public void setKeyId(FileStorageKey keyid) {
        this.keyid = keyid;
    }
    public String getfile_folder() {
        return file_folder;
    }

    public void setFile_Folder(String file_folder) {
        this.file_folder = file_folder;
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
        if(size== null)
        {
            return 0L;
        }
        else {
            return size;
        }
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
    public String getFolderName() {
        return foldername;
    }

    public void setFolderName(String foldername) {
        this.foldername = foldername;
    }
}