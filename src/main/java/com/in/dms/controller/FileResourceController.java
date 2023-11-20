package com.in.dms.controller;

import com.in.dms.model.FileStorage;
import com.in.dms.model.FileStorageKey;
import com.in.dms.repository.FileStorageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import static java.nio.file.Files.copy;
import static java.nio.file.Paths.get;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;


@RestController
@RequestMapping("/file")
public class FileResourceController {@Autowired
private FileStorageRepository fileStorageRepository;



    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads";
    @GetMapping("/count-by-type")
    public ResponseEntity<Map<String, Long>> countFilesByType() {
        List<FileStorage> files = fileStorageRepository.findAll(); // Fetch the data from your repository

        // Group files by file type and count them, mapping null values to "Unknown"
        Map<String, Long> typeCounts = files.stream()
                .collect(Collectors.groupingBy(
                        file -> file.getType() != null ? file.getType() : "Unknown",
                        Collectors.counting()
                ));

        return ResponseEntity.ok().body(typeCounts);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFilesToDatabase(@RequestParam("file") MultipartFile[] files) {
        List<String> successMessages = new ArrayList<>();
        List<String> errorMessages = new ArrayList();

        for (MultipartFile file : files) {
            try {
                String filename = StringUtils.cleanPath(file.getOriginalFilename());
                Path path = Paths.get(DIRECTORY, filename).toAbsolutePath().normalize();
                BasicFileAttributes fileAttributes = Files.readAttributes(path, BasicFileAttributes.class);

                String type = file.getContentType();
                FileStorageKey key = new FileStorageKey();
                key.setId(key.getId()); // Set the id value
                key.setVersion_id(key.getVersion_id());
                FileStorage fileStorage = new FileStorage();
                fileStorage.setKeyId(key);
                fileStorage.setFilename(file.getOriginalFilename());
                fileStorage.setFiledata(file.getBytes());
                fileStorage.setSize(file.getSize());
                fileStorage.setType(type);
                fileStorage.setTimestamp(LocalDateTime.now());
                fileStorageRepository.save(fileStorage);

                successMessages.add("File '" + file.getOriginalFilename() + "' uploaded to the database successfully");
            } catch (IOException e) {
                errorMessages.add("File '" + file.getOriginalFilename() + "' upload to the database failed");
            }
        }
        Map<String, String> response = new HashMap<>();

        response.put("status", "success");
        response.put("successMessages", String.valueOf(successMessages));
        response.put("errorMessages", String.valueOf(errorMessages));

        return ResponseEntity.ok(response);
    }

    // Define a method to download files
    @GetMapping("download/{filename}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename) throws IOException {
        Path filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(filename);
        if(!Files.exists(filePath)) {
            throw new FileNotFoundException(filename + " was not found on the server");
        }
        Resource resource = new UrlResource(filePath.toUri());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("File-Name", filename);
        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .headers(httpHeaders).body(resource);
    }
    @GetMapping("/getall")
    public ResponseEntity<List<FileStorage>> getAllFiles() {
        List<FileStorage> files = fileStorageRepository.findAll(); // Assuming you have a repository for FileStorage
        List<FileStorage> fileMetadataList = new ArrayList<>();
        FileStorageKey fileStorageKey= new FileStorageKey();
        for (FileStorage file : files) {
            FileStorage fileMetadata = new FileStorage();
            fileMetadata.setFilename(file.getFilename());
            fileMetadata.setTimestamp(file.getTimestamp());
            fileMetadata.setKeyId(file.getKeyId());

            Long size = file.getSize(); // Use Long instead of long

            if (size != null) {
                fileMetadata.setSize(size.longValue());
            } else {
                fileMetadata.setSize(null);
            }
            // fileMetadata.setVersionId(fileStorageKey.getVersion_id());
            fileMetadataList.add(fileMetadata);
        }

        return ResponseEntity.ok(fileMetadataList);
    }


}