package com.in.dms.service;

import com.in.dms.model.FileStorage;
import com.in.dms.repository.FileStorageRepository;
import com.in.dms.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {
    @Autowired
    private FileStorageRepository filestoragerepo;

       public List<FileStorage> getAllFiles() {
        return filestoragerepo.findAll();
    }
}
