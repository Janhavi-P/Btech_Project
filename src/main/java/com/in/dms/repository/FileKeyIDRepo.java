package com.in.dms.repository;

import com.in.dms.model.FileStorage;
import com.in.dms.model.FileStorageKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileKeyIDRepo extends JpaRepository<FileStorage, FileStorageKey> {
    // You can add custom queries if needed
}
