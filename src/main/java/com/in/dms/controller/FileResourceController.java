package com.in.dms.controller;

import com.in.dms.model.FileStorage;
import com.in.dms.model.FileStorageKey;
import com.in.dms.model.Folder;
import com.in.dms.repository.FileKeyIDRepo;
import com.in.dms.repository.FileStorageRepository;

import com.in.dms.repository.FolderRepository;
import com.in.dms.service.FileService;
import com.in.dms.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


import static java.nio.file.Files.copy;
import static java.nio.file.Paths.get;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;


@RestController
@RequestMapping("/file")
public class FileResourceController {
    @Autowired
    private FileKeyIDRepo filekeyidrepo;
    @Autowired
    private FolderService folderService;

    @Autowired
    private FileService fileService;
    @Autowired
    private FileStorageRepository fileStorageRepository;
private FolderRepository folderRepo;


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
    public ResponseEntity<Map<String, String>> uploadFilesToDatabase(@RequestParam("file") MultipartFile[] files,
                                                                     @RequestParam("employeeid") String EmployeeID,
                                                                     @RequestParam("folderName") String foldername
                                                                     )
    {

        List<String> successMessages = new ArrayList<>();
        List<String> errorMessages = new ArrayList();
        Integer employeeIdInt = Integer.parseInt(EmployeeID);
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
                fileStorage.setEmployeeId(employeeIdInt);
                fileStorage.setFolderName(foldername);
              //  fileStorage.setFile_Folder("file");
                //fileStorage.setEmployeeId(employeeIdInt);
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

    @GetMapping("/quickaccess/{EmployeeId}")
    public ResponseEntity<List<FileStorage>> getQuickAccess(@PathVariable Integer EmployeeId) {
        if (EmployeeId == null) {
            // Handle the case where employeeId is not provided
            return ResponseEntity.badRequest().build();
        }
        List<FileStorage> files = fileStorageRepository.findAllByEmployeeIdOrderByTimestampDesc(EmployeeId);

        List<FileStorage> fileMetadataList = new ArrayList<>();

        for (FileStorage file : files) {
            FileStorage fileMetadata = new FileStorage();
            fileMetadata.setFilename(file.getFilename());
            fileMetadata.setTimestamp(file.getTimestamp());
            fileMetadata.setKeyId(file.getKeyId());
            fileMetadata.setType(file.getType());

            String type=file.getType();
            if(type!="folder") {
                Long size = file.getSize(); // Use Long instead of long

                if (size != null) {
                    fileMetadata.setSize(size);
                } else {
                    fileMetadata.setSize(0L);
                }
            }
            else{
                fileMetadata.setSize(0L);
            }
            fileMetadataList.add(fileMetadata);
        }

        return ResponseEntity.ok(fileMetadataList);
    }

    @GetMapping("/content/{filename}")
    public ResponseEntity<Resource> getFileContent(@PathVariable String filename) throws IOException {
        // Find the file by filename
        List<FileStorage> files = fileStorageRepository.findByFilename(filename);

        if (files.isEmpty()) {
            // Return a 404 Not Found response if the file is not found
            return ResponseEntity.notFound().build();
        }

        // Assuming you're using the first file from the list
        FileStorage file = files.get(0);

        // Build the file path
        Path filePath = Paths.get(DIRECTORY).resolve(file.getFilename());

        // Load the file as a resource
        Resource resource = new UrlResource(filePath.toUri());

        // Set content type dynamically based on file extension
        String contentType = determineContentType(file.getFilename());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDisposition(ContentDisposition.builder("inline").filename(filename).build());

        // Return the file content with appropriate headers
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private String determineContentType(String filename) {
        if (filename.endsWith(".pdf")) {
            return "pdf";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".pptx")) {
            return "pptx";
        } else if (filename.endsWith(".docx")) {
            return "docx";
        } else if (filename.endsWith(".csv")||filename.endsWith(".CSV")) {
            return "text/csv";
        } else {
            // Default to octet-stream for unknown types
            return "application/octet-stream";
        }
    }
//    @GetMapping("/file-count-by-type/{employeeId}") working
//    public ResponseEntity<Map<String, Object>> countFilesByTypeForEmployee(@PathVariable Integer employeeId) {
//        List<Folder> files = folderService.getFoldersByEmployeeId(employeeId);
//
//        // Group files by file type and count them, mapping null values to "Unknown"
//        Map<String, Long> typeCounts = files.stream()
//                .collect(Collectors.groupingBy(
//                        file -> file.getFileType() != null ? file.getFileType() : "Unknown",
//                        Collectors.counting()
//                ));
//
//        // Calculate the total count of files
//        long totalCount = files.size();
//
//        // Convert the map to a list of maps
//        List<Map<String, Object>> fileTypeCounts = typeCounts.entrySet().stream()
//                .map(entry -> {
//                    Map<String, Object> fileTypeCount = new HashMap<>();
//                    fileTypeCount.put("fileType", entry.getKey());
//                    fileTypeCount.put("count", entry.getValue());
//                    return fileTypeCount;
//                })
//                .collect(Collectors.toList());
//
//        // Create the response map
//        Map<String, Object> responseMap = new HashMap<>();
//        responseMap.put("totalFiles", totalCount);
//        responseMap.put("fileTypeCounts", fileTypeCounts);
//
//        return ResponseEntity.ok().body(responseMap);
//    }
@GetMapping("/file-count-by-type/{employeeId}")
public ResponseEntity<Map<String, Object>> countFilesByTypeForEmployee(@PathVariable Integer employeeId) {
    List<Folder> files = folderService.getFoldersByEmployeeId(employeeId);

    // Group files by file type and count them, mapping null values to "Unknown"
    Map<String, Long> typeCounts = files.stream()
            .collect(Collectors.groupingBy(
                    file -> file.getFileType() != null ? file.getFileType() : "Unknown",
                    Collectors.counting()
            ));

    // Calculate the total count of files
    long totalFilesCount = files.size();

    // Calculate the total count of folders
    long totalFoldersCount = files.stream()
            .filter(file -> "folder".equalsIgnoreCase(file.getFileType()))
            .count();

    // Convert the map to a list of maps
    List<Map<String, Object>> fileTypeCounts = typeCounts.entrySet().stream()
            .map(entry -> {
                Map<String, Object> fileTypeCount = new HashMap<>();
                fileTypeCount.put("fileType", entry.getKey());
                fileTypeCount.put("count", entry.getValue());
                return fileTypeCount;
            })
            .collect(Collectors.toList());

    // Create the response map
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("totalFiles", totalFilesCount);
    responseMap.put("totalFolders", totalFoldersCount);
    responseMap.put("fileTypeCounts", fileTypeCounts);

    return ResponseEntity.ok().body(responseMap);
}

@GetMapping("/total-memory-used")
public ResponseEntity<String> getTotalMemoryUsed() {
    List<FileStorage> files = fileService.getAllFiles();

    // Calculate the total size of all files
    long totalSizeInBytes = files.stream()
            .filter(file -> !"folder".equals(file.getType()))
            .mapToLong(FileStorage::getSize)
            .sum();

    System.out.println(totalSizeInBytes);
    // Convert the total size to GB
//    double totalSizeInGB = (double) totalSizeInBytes / (1024 * 1024 * 1024);
//
//    // Format the result as a string
//    String result = String.format("Total Memory Used: %.2f GB", totalSizeInGB);
// Convert the total size to MB
    double totalSizeInMB = (double) totalSizeInBytes / (1024 * 1024);

// Format the result as a string
    String result = String.format("Total Memory Used: %.2f MB", totalSizeInMB);

    return ResponseEntity.ok(result);
}
    @GetMapping("/file-count-by-date/{employeeId}")
    public ResponseEntity<Map<String, Object>> countFilesByDateForEmployee(@PathVariable Integer employeeId) {
        List<Folder> files = folderService.getFoldersByEmployeeId(employeeId);

        // Group files by file type and count them, mapping null values to "Unknown"
        Map<String, Long> dateCounts = files.stream()
                .collect(Collectors.groupingBy(
                        file -> file.getCreatedTime().toLocalDate().toString(),
                        Collectors.counting()
                ));

        // Calculate the total count of files
        long totalCount = files.size();

        // Convert the map to a list of maps
        List<Map<String, Object>> dateFileCounts = dateCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> dateFileCount = new HashMap<>();
                    dateFileCount.put("date", entry.getKey());
                    dateFileCount.put("count", entry.getValue());
                    return dateFileCount;
                })
                .collect(Collectors.toList());

        // Create the response map
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("totalFiles", totalCount);
        responseMap.put("dateFileCounts", dateFileCounts);

        return ResponseEntity.ok().body(responseMap);
    }

//     Define a method to download files
//    @GetMapping("download/{filename}")
//    public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename) throws IOException {
//        Path filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(filename);
//        if(!Files.exists(filePath)) {
//            throw new FileNotFoundException(filename + " was not found on the server");
//        }
//        Resource resource = new UrlResource(filePath.toUri());
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.add("File-Name", filename);
//        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
//        return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
//                .headers(httpHeaders).body(resource);
//    }
//    @GetMapping("download/{filename}")   working
//    public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename) throws IOException {
//        // Extract the original filename without the version number
//        String originalFilename = extractOriginalFilename(filename);
//
//        Path filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(filename);
//
//        if (!Files.exists(filePath)) {
//            // Try with the original filename
//            filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(originalFilename);
//
//            if (!Files.exists(filePath)) {
//                throw new FileNotFoundException(originalFilename + " was not found on the server");
//            }
//        }
//
//        Resource resource = new UrlResource(filePath.toUri());
//
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.add("File-Name", originalFilename);
//        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
//                .headers(httpHeaders)
//                .body(resource);
//    }
@GetMapping("download/{id}/{versionId}/{filename}")
public ResponseEntity<Resource> downloadFiles(
        @PathVariable("id") Long id,
        @PathVariable("versionId") Integer versionId
) throws IOException {
    // Create a key based on id and versionId
    FileStorageKey key = new FileStorageKey();
    key.setId(id);
    key.setVersion_id(versionId);

    // Use the key to fetch the file from the repository
    Optional<FileStorage> optionalFile = filekeyidrepo.findById(key);

    if (optionalFile.isPresent()) {
        FileStorage file = optionalFile.get();

        // Extract the original filename without the version number
        String originalFilename = extractOriginalFilename(file.getFilename());

        Path filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(file.getFilename());

        if (!Files.exists(filePath)) {
            // Try with the original filename
            filePath = get(DIRECTORY).toAbsolutePath().normalize().resolve(originalFilename);

            if (!Files.exists(filePath)) {
                throw new FileNotFoundException(originalFilename + " was not found on the server");
            }
        }

        Resource resource = new UrlResource(filePath.toUri());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("File-Name", originalFilename);
        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .headers(httpHeaders)
                .body(resource);
    } else {
        throw new FileNotFoundException("File not found with id=" + id + " and versionId=" + versionId);
    }
}
    private String extractOriginalFilename(String filename) {
        // Extract the original filename without the version number
        int indexOfUnderscore = filename.lastIndexOf('_');
        return (indexOfUnderscore != -1) ? filename.substring(0, indexOfUnderscore) : filename;
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
    @DeleteMapping("/delete/{id}/{versionId}")
    public ResponseEntity<String> deleteFile(
            @PathVariable("id") Long id,
            @PathVariable("versionId") Integer versionId
    ) {
        // Combine id and versionId to create a key
        FileStorageKey key = new FileStorageKey();
        key.setId(id);
        key.setVersion_id(versionId);

        // Check if the file exists
        Optional<FileStorage> optionalFile = filekeyidrepo.findById(key);
        if (optionalFile.isPresent()) {
            FileStorage file = optionalFile.get();

            // Implement your logic to delete the file
            // For example, you can use the delete method from the repository
            fileStorageRepository.delete(file);

            return ResponseEntity.ok("File deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }
}

