package com.in.dms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Employees")
public class Login {
    @Id
    @Column(name = "Employee_id")
    private Integer employeeid;
    @Column(name = "Email_Id")
    private  String username;
    @Lob
    @Column(name = "profile", columnDefinition = "MEDIUMBLOB")
    private byte[] profilePicture;

    @Column(name = "Name")
    private  String name;
    @Column(name = "Password")
    private String password;
    @Column(name="Role")
    private String role;
    public Login() {
        // Default constructor
    }
    public Login(String emailId, String password,String role,String name,byte[] profilePicture,Integer employeeid){

        this.username = emailId;
        this.password = password;
        this.role=role;
        this.name=name;
        this.profilePicture = profilePicture;
        this.employeeid=employeeid;
    }
    public Integer getEmpid() {
        return employeeid;
    }

    public void setEmpid(Integer employeeid) {
        this.employeeid = employeeid;
    }
    public String getEmailId() {
        return username;
    }

    public void setEmailId(String emailId) {
        this.username = emailId;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

}
