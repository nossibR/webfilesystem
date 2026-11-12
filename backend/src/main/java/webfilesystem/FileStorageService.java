package webfilesystem;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(
            @Value("${file.upload-dir}") String uploadDir) {

        this.storageLocation = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(storageLocation);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create storage directory", e);
        }
    }

    // Save physical file
    public void saveFile(MultipartFile file, String fileName) {

        try {
            Path target = storageLocation.resolve(fileName).normalize();

            if (!target.startsWith(storageLocation)) {
                throw new RuntimeException("Invalid file name");
            }

            Files.copy(file.getInputStream(), target,
                    StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            throw new RuntimeException("Could not save file", e);
        }
    }

    // Delete physical file
    public void deleteFile(String fileName) {

        try {
            Path target = storageLocation.resolve(fileName).normalize();

            if (!target.startsWith(storageLocation)) {
                throw new RuntimeException("Invalid file name");
            }

            Files.deleteIfExists(target);

        } catch (IOException e) {
            throw new RuntimeException("Could not delete file", e);
        }
    }

    public Resource loadAsResource(String fileName) {

        try {
            Path filePath = storageLocation.resolve(fileName).normalize();

            if (!filePath.startsWith(storageLocation)) {
                throw new RuntimeException("Invalid file name");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new RuntimeException("File not found");

        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file", e);
        }
    }

    public void renameFile(String oldName, String newName) {

        try {
            Path oldPath = storageLocation.resolve(oldName).normalize();
            Path newPath = storageLocation.resolve(newName).normalize();

            if (!oldPath.startsWith(storageLocation) ||
                    !newPath.startsWith(storageLocation)) {
                throw new RuntimeException("Invalid file name");
            }

            if (!Files.exists(oldPath)) {
                throw new RuntimeException("Original file not found");
            }

            if (Files.exists(newPath)) {
                throw new RuntimeException("A file with this name already exists");
            }

            Files.move(oldPath, newPath);

        } catch (IOException e) {
            throw new RuntimeException("Could not rename file", e);
        }
    }
}
