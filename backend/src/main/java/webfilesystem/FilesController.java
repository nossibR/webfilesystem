package webfilesystem;

import java.util.List;
import webfilesystem.entity.FileEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.*;

@RestController
@RequestMapping("/api")
public class FilesController {

    private final WFSService service;
    private final FileStorageService fileStorageService;

    public FilesController(WFSService service, FileStorageService fileStorageService) {
        this.service = service;
        this.fileStorageService = fileStorageService;
    }

    // Get all files from database
    @GetMapping("/getfiles")
    public List<FileEntity> getFiles() {
        return service.getFiles();
    }

    // Upload a physical file and save its metadata
    @PostMapping("/createfile")
    public int createFile(@RequestParam("file") MultipartFile file) {
        return service.createFile(file);
    }

    // Modify file name in database
    @PutMapping("/updatefile")
    public int updateFile(
            @RequestParam int id,
            @RequestParam String name) {

        return service.updateFile(id, name);
    }

    // Delete file from database and local folder
    @DeleteMapping("/deletefile")
    public int deleteFile(@RequestParam int id) {
        return service.deleteFile(id);
    }

    @GetMapping("/downloadfile/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int id) {

        FileEntity file = service.getFileById(id);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadAsResource(file.getName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(file.getName())
                                .build()
                                .toString())
                .body(resource);
    }
}
