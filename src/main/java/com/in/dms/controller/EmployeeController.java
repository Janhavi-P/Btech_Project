package com.in.dms.controller;

import com.in.dms.model.Employee;
import com.in.dms.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")

@CrossOrigin(origins="http://localhost:4200")

public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
     @PostMapping("/add")
    public Employee addEmployee(@RequestBody Employee employee)
     {
         System.out.println("Received employee object:");
         System.out.println("Name: " + employee.getName());
         System.out.println("Email: " + employee.getEmailId());
         System.out.println("Employee ID: " + employee.getEmployeeid());
         System.out.println("Role: " + employee.getRole());
         System.out.println("Department: " + employee.getDepartment());
         System.out.println("Password: " + employee.getPassword());
         System.out.println("Contactno: " + employee.getContact_no());

         // Print other fields as needed
            return employeeService.saveEmployee(employee);
     }



}
