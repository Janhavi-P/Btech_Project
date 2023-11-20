package com.in.dms.controller;

import com.in.dms.model.Employee;
import com.in.dms.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/employees")

@CrossOrigin(origins="http://localhost:4200")

public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PutMapping("/editProfile/{employeeId}")
    public ResponseEntity<Employee> editProfile(@PathVariable Integer employeeId,@RequestBody Employee editedEmployee)
    {
        Employee existingEmployee=employeeService.getEmployeeById(employeeId);
        if(existingEmployee==null)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existingEmployee.setName(editedEmployee.getName());
        existingEmployee.setEmailId(editedEmployee.getEmailId());
        existingEmployee.setPosition(editedEmployee.getPosition());
        existingEmployee.setContact_no(editedEmployee.getContact_no());
        existingEmployee.setDepartment(editedEmployee.getDepartment());
        existingEmployee.setProfilePicture(editedEmployee.getProfilePicture());

        Employee updatedEmployeeRecord=employeeService.saveEmployee(existingEmployee);
        return new ResponseEntity<>(updatedEmployeeRecord,HttpStatus.OK);
    }
    @GetMapping("/get/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer employeeId) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        if (employee != null) {
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
     @PostMapping("/add")
     public ResponseEntity addEmployee(@ModelAttribute Employee employee, @RequestPart("profile") MultipartFile profile)

     {
         System.out.println("Inside Add api");
         System.out.println("Received employee object:");
         System.out.println("Name: " + employee.getName());
         System.out.println("Email: " + employee.getEmailId());
         System.out.println("Employee ID: " + employee.getEmployeeid());
         System.out.println("Role: " + employee.getRole());
         System.out.println("Department: " + employee.getDepartment());
         System.out.println("Password: " + employee.getPassword());
         System.out.println("Contactno: " + employee.getContact_no());
         System.out.println("profilepic: " + employee.getProfilePicture());
         if (employeeService.existsById(employee.getEmployeeid())) {
             // Employee with the same ID already exists
             return new ResponseEntity<>("Employee with ID " + employee.getEmployeeid() + " already exists.", HttpStatus.CONFLICT);
         }

         if (profile != null) {
             try {
                 byte[] profilePictureBytes = profile.getBytes();
                 employee.setProfilePicture(profilePictureBytes);
             } catch (IOException e) {
                 e.printStackTrace();
                 // Handle the exception if there's an issue with the file
             }
         }
         // Print other fields as needed
         Employee savedEmployee = employeeService.saveEmployee(employee);
         return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
     }

@GetMapping("/getusers")
    public ResponseEntity<List<Employee>> getAllEmployees()
{
    List<Employee> employee=employeeService.getAllEmployees();
    return new ResponseEntity<>(employee,HttpStatus.OK);
}
//    @GetMapping("/get/{employeeId}")
//    {
//        public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer employeeId)
//        {
//            Employee employee=employeeService.getEmployeeById(employeeId);
//            if (employee != null) {
//                return new ResponseEntity<>(employee, HttpStatus.OK);
//            } else {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//        }
//    }

}
