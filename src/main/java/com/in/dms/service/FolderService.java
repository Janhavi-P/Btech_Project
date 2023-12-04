package com.in.dms.service;
import com.in.dms.model.FileStorageKey;
import com.in.dms.model.Folder;
import com.in.dms.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service

public class FolderService {
    @Autowired
    private FolderRepository folderRepository;
    public List<Folder> getAllFolders(){
        return folderRepository.findAll();
    }

    public List<Folder> getFoldersByEmployeeId(Integer employeeId) {
                return folderRepository.findByEmployeeId(employeeId);
    }
    public Folder createFolder(String folderName,Integer employeeId,String parentFolderName)
    {
        Folder folder=new Folder();
        FileStorageKey key = new FileStorageKey();
        key.setId(key.getId()); // Set the id value
        key.setVersion_id(key.getVersion_id());
        folder.setKeyId(key);
        folder.setFileName(folderName);
        folder.setEmployeeid(employeeId);
        folder.setCreatedTime(LocalDateTime.now());
        // Check if parentFolderName is provided and set it if present
        if (parentFolderName != null) {
            // Assuming there's a setParentFolderName method in your Folder class
            folder.setFolderName(parentFolderName);
        }
        folder.setFileType("folder");
        System.out.println(parentFolderName);
        return folderRepository.save(folder);
    }
    public List<Folder> getFilesByEmployeeIdAndFolderName(Integer employeeId, String parentFolderName) {
        // Assuming you have a method in your repository to fetch files based on employeeId and folderName
        List<Folder> files = folderRepository.findByEmployeeIdAndParentFolderName(employeeId, parentFolderName);
        return files;
    }
}
