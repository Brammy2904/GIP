package helloWorld;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
	AddToDb add;
	@Autowired
	private HScoresRepository HScoreRep;

	@GetMapping("/addRandom")
	public String AddRandom() {
		String[] Beginning = { "Kr", "Ca", "Ra", "Mrok", "Cru", "Ray", "Bre", "Zed", "Drak", "Mor", "Jag", "Mer", "Jar",
				"Mjol", "Zork", "Mad", "Cry", "Zur", "Creo", "Azak", "Azur", "Rei", "Cro", "Mar", "Luk" };
		String[] Middle = { "air", "ir", "mi", "sor", "mee", "clo", "red", "cra", "ark", "arc", "miri", "lori", "cres",
				"mur", "zer", "marac", "zoir", "slamar", "salmar", "urak" };
		String[] End = { "d", "ed", "ark", "arc", "es", "er", "der", "tron", "med", "ure", "zur", "cred", "mur" };
		Random rand = new Random();
		int aantal = 20;
		for(int i = 0; i < aantal; i++) {
		String name = Beginning[rand.nextInt(Beginning.length)] + Middle[rand.nextInt(Middle.length)]
				+ End[rand.nextInt(End.length)];
		String loser = Beginning[rand.nextInt(Beginning.length)] + Middle[rand.nextInt(Middle.length)]
				+ End[rand.nextInt(End.length)];
		if(loser.contentEquals(name)) {
			loser = Beginning[rand.nextInt(Beginning.length)] + Middle[rand.nextInt(Middle.length)]
					+ End[rand.nextInt(End.length)];
		}
		int levens = rand.nextInt(50-1) + 1;
		int time = rand.nextInt(80-20) + 20;
		add.initHScore(levens, name
				,time, loser);
		}
		return "Added "+ aantal+" highscores";
			
	}

	@GetMapping("/highscore")
	public Iterable<HighScores> test() {
		return HScoreRep.getAllHScores();
	}

	@GetMapping("/getHighScore")
	public Iterable<HighScores> findHighScoreByName(@RequestParam(required = false) String name) {

		return HScoreRep.findHighScore(name);
	}
}
