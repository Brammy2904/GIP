package helloWorld;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
public class HtmlContoller {
	@Autowired
	private PlaneRepository planeRep;
	
	@GetMapping("/start")
	String ShowPage() {
		System.out.println("test");
		return "Play";
	}
	@GetMapping("/start1")
	String ShowPage1() {
		return "MPTest";
	}
	@GetMapping("/teste")
	String test() {
		return "teste";
	}
	
}
