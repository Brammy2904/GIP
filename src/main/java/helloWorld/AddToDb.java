package helloWorld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddToDb {
	@Autowired
	private HScoresRepository HScoreRep;

	public void initHScore(Integer levens, 
	String name, Integer time, 
	String loser) {
		HighScores Hscore = new HighScores();
		Hscore.setLevens(levens);
		Hscore.setName(name);
		Hscore.setTime(time);
		Hscore.setLoser(loser);
		HScoreRep.save(Hscore);
	}

}
