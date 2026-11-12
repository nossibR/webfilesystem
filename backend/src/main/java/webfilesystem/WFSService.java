package webfilesystem;

import webfilesystem.entity.FileEntity;

import java.util.List;
import java.nio.file.Paths;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
public class WFSService {

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;

    public WFSService(
            FileRepository fileRepository,
            FileStorageService fileStorageService) {

        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
    }

    // Get all files
    public List<FileEntity> getFiles() {
        return fileRepository.findAll();
    }

    // Create file
    public int createFile(MultipartFile file) {

        try {
            String fileName = file.getOriginalFilename();

            if (fileName == null || fileName.isBlank()) {
                return 0;
            }

            // Save physical file
            fileStorageService.saveFile(file, fileName);

            // Save metadata in database
            FileEntity entity = new FileEntity();
            entity.setName(fileName);

            fileRepository.save(entity);

            return 1;

        } catch (Exception e) {
            return 0;
        }
    }

    public int updateFile(int id, String name) {

        FileEntity file = fileRepository.findById(id)
                .orElse(null);

        if (file == null || name == null || name.isBlank()) {
            return 0;
        }

        String newName = Paths.get(name).getFileName().toString();

        if (!newName.equals(name)) {
            return 0;
        }

        try {
            fileStorageService.renameFile(file.getName(), newName);

            file.setName(newName);
            fileRepository.save(file);

            return 1;

        } catch (Exception e) {
            return 0;
        }
    }

    // Delete file
    public int deleteFile(int id) {

        FileEntity file = fileRepository.findById(id)
                .orElse(null);

        if (file == null) {
            return 0;
        }

        // Delete physical file
        fileStorageService.deleteFile(file.getName());

        // Delete database record
        fileRepository.deleteById(id);

        return 1;
    }

    public FileEntity getFileById(int id) {
        return fileRepository.findById(id).orElse(null);
    }
}
