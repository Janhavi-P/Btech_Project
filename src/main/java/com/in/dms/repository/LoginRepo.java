package com.in.dms.repository;

import com.in.dms.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepo extends JpaRepository<Login,String> {
    Login findByUsername(String Username);
}
