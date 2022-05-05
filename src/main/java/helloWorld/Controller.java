package helloWorld;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;




import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class Controller {

	@Autowired
	private HScoresRepository HScoreRep;


	

	@GetMapping("/highscore")
	public	Iterable<HighScores> test() {
		return HScoreRep.getAllHScores();
	}

	@GetMapping("/getHighScore")
	public Iterable<HighScores> findHighScoreByName(@RequestParam(required = false) String name) {

		return HScoreRep.findHighScore(name);
	}
}
