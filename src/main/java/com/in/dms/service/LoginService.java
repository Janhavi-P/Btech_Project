
package com.in.dms.service;

import com.in.dms.model.Login;
import com.in.dms.repository.LoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {
    @Autowired
    private LoginRepo loginRepo;
    public Map<String, Object> authenticateUser(String username,String password)
    {
        Login login=loginRepo.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (login != null && login.getPassword().equals(password)) {
            response.put("message", "Login Successful");
            response.put("role", login.getRole()); // Add user's role to the response
            response.put("Name", login.getName());
            response.put("ProfilePic",login.getProfilePicture());
            response.put("EmployeeId",login.getEmpid());

        } else {
            response.put("message", "Authentication failed");
        }
    return response;
    }

}
