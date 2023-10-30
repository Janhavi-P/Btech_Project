package com.in.dms.service;

import com.in.dms.model.Employee;
import com.in.dms.repository.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepo employeeRepository;

    public Employee saveEmployee(Employee employee)
    {

        return employeeRepository.save(employee);
    }


}
