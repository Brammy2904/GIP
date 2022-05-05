package helloWorld;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


@Entity(name = "highscores")
public class HighScores {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	public Integer id;

	@Column(name = "levens")
	public Integer levens;
	@Column(name="name")
	public String name;
	@Column(name = "time")
	public Integer time;
	@Column(name="loser")
	public String loser;
	public void setId(Integer id) {
		this.id = id;
	}
	public void setTime(Integer time) {
		this.time = time;
	}
	public void setLevens(Integer levens) {
		this.levens = levens;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setLoser(String loser) {
		this.loser = loser;
	}
}
