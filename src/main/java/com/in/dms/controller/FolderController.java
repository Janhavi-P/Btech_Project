package com.in.dms.controller;

import com.in.dms.model.Folder;
import com.in.dms.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/folder")
@CrossOrigin(origins="http://localhost:4200")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @GetMapping("/getfolders")
    public List<Folder> getAllFolders()
    {
        return folderService.getAllFolders();
    }

    @GetMapping("/employeefolders/{employeeId}")
    public List<Folder> getFoldersByEmployeeId(@PathVariable Integer employeeId) {
        return folderService.getFoldersByEmployeeId(employeeId);
    }

    @GetMapping("/files/{employeeId}/{folderName}")
    public List<Folder> getFilesInFolderByEmployeeIdAndFolderName(
            @PathVariable Integer employeeId,
            @PathVariable String folderName
    ) {
        System.out.println(folderService.getFilesByEmployeeIdAndFolderName(employeeId, folderName));
        return folderService.getFilesByEmployeeIdAndFolderName(employeeId, folderName);
    }
//    @PostMapping("/createfolder")
//    public ResponseEntity<Folder> createFolder(@RequestBody Map<String, Object> folderData) {
//        String folderName = (String) folderData.get("folderName");
//        Integer employeeId = (Integer) folderData.get("employeeId");
//
//        // Your existing logic to create the folder
//        Folder createdFolder = folderService.createFolder(folderName, employeeId);
//
//        return ResponseEntity.ok(createdFolder);
//    }

    @PostMapping("/createfolder")
    public ResponseEntity<Folder> createFolder(@RequestBody Map<String, Object> folderData) {
        String folderName = (String) folderData.get("folderName");  //name of new added folder
        Integer employeeId = (Integer) folderData.get("employeeId");

        // Check if the 'parentFolderName' key is present in the request
        String parentFolderName = folderData.containsKey("parentFolderName") ?
                (String) folderData.get("parentFolderName") :
                null;

        // Your existing logic to create the folder
        Folder createdFolder = folderService.createFolder(folderName, employeeId, parentFolderName);

        return ResponseEntity.ok(createdFolder);
    }


}
