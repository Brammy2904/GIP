package helloWorld;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;




import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;


import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class Controller {

	@Autowired
	private PlaneRepository planeRep;


	

	@GetMapping("/test")
	public	Iterable<Plane> test() {
		return planeRep.getAllPlane();
	}
//	@GetMapping("/get")
//	public File getFile() throws IOException {
//
//		Resource resource = new ClassPathResource("bullet.png");
//
//		InputStream input = resource.getInputStream();
//
//		File file = resource.getFile();
//		return file;
//	}

}
