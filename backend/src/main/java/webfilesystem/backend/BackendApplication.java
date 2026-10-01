package webfilesystem.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	@GetMapping("/")
	public String index(){
		return "Hey";
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
