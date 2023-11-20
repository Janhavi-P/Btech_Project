package com.in.dms.controller;

import com.in.dms.model.Login;
import com.in.dms.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Base64;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController

@CrossOrigin(origins="http://localhost:4200")

public class LoginController {
    @Autowired
    private LoginService loginService;
    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>>  login(@RequestBody Map<String,String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");
        Map<String, Object> response = loginService.authenticateUser(username, password);
        // Map<String, String> response = new HashMap<>();
        if (response.containsKey("role")) {
            // User successfully authenticated, you can access the role here
            String userRole = (String) response.get("role");
            String userName = (String) response.get("Name");
            Integer empid = (Integer) response.get("EmployeeId");
            System.out.println(empid);
            byte[] profilePic = (byte[]) response.get("ProfilePic");
            response.put("Name", userName);
            response.put("ProfilePic",convertToBase64(profilePic));
            response.put("EmployeeId",empid);
            // You can now add logic to route based on the user's role
        }

        return ResponseEntity.ok(response);
    }
    private String convertToBase64(byte[] data) {
        if (data != null) {
            return Base64.getEncoder().encodeToString(data);
        }
        return null;
    }
    }

