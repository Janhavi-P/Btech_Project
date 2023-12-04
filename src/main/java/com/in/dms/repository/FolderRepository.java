package com.in.dms.repository;

import com.in.dms.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder,Integer> {
    List<Folder> findByEmployeeId(Integer employeeId);

    List<Folder> findByEmployeeIdAndParentFolderName(Integer employeeId, String parentFolderName);
//    List<Folder> findByEmployeeIdAndFolderName(Integer employeeId, String folder_name);

}
