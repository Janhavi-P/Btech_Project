    package com.in.dms.model;
    import jakarta.persistence.*;


    @Entity
    @Table(name = "Employees")
    public class Employee {

        @Id
        @Column(name = "Employee_id")
        private Integer employeeid;

        @Column(name = "Name")
        private String name;
        @Column(name = "Email_id")
        private String emailid;
        @Column(name = "Password")
        private String password;
        @Column(name = "Position")
        private String position;

        @Column(name = "Department")
        private String department;

        @Column(name = "Contact_no")
        private String contact_no;

        @Column(name = "Role")
        private String role;

        @Lob
        @Column(name = "profile", columnDefinition = "MEDIUMBLOB")
        private byte[] profilePicture;


        // Constructors
        public Employee() {
            // Default constructor
        }

        public Employee(Integer employeeId, String name, String emailId, String password, String position, String department, String contactNo, String role, byte[] profilePicture) {
            this.employeeid = employeeId;
            this.name = name;
            this.emailid = emailId;
            this.password = password;
            this.position = position;
            this.department = department;
            this.contact_no = contactNo;
            this.role = role;
            this.profilePicture = profilePicture;
        }

        // Getters and setters
        public Integer getEmployeeid() {
            return employeeid;
        }

        public void setEmployeeid(Integer employeeid) {
            this.employeeid = employeeid;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmailId() {
            return emailid;
        }

        public void setEmailId(String emailId) {
            this.emailid = emailId;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getContact_no() {
            return contact_no;
        }

        public void setContact_no(String contact_no) {
            this.contact_no = contact_no;
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

