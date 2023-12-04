package com.in.dms.repository;

import com.in.dms.model.FileStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileStorageRepository extends JpaRepository<FileStorage, Long> {
    @Query("SELECT f FROM FileStorage f ORDER BY f.timestamp DESC ")
    List<FileStorage> findAllByEmployeeIdOrderByTimestampDesc(Integer EmployeeId);
    List<FileStorage> findByFilename(String filename);
// @Query("SELECT f FROM FileStorage f WHERE f.EmployeeId = :EmployeeId")
//    List<FileStorage> findByEmployeeId(@Param("EmployeeId") Integer EmployeeId);

}