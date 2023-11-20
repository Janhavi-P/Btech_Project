package com.in.dms.service;

import com.in.dms.model.Employee;
import com.in.dms.repository.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepo employeeRepository;

    public Employee saveEmployee(Employee employee)
    {

        return employeeRepository.save(employee);
    }
    public boolean existsById(Integer id) {
        Optional<Employee> employee = employeeRepository.findById(String.valueOf(id));
        return employee.isPresent();
    }
public List<Employee> getAllEmployees()
{
return employeeRepository.findAll();
}
    public Employee getEmployeeById(Integer id) {
        Optional<Employee> employee = employeeRepository.findById(String.valueOf(id));
        return employee.orElse(null); // Return null if the employee with the given ID doesn't exist
    }
}
