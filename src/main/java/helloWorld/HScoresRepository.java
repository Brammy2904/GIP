package helloWorld;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@Repository
public interface HScoresRepository extends CrudRepository<HighScores, Integer> {

	@Query(value = "Select * from highscores h "
	+ "ORDER BY h.levens desc, h.time asc", nativeQuery = true)
	Iterable<HighScores> getAllHScores();
	@Query(value = "select * from highscores a "
	+ "where a.name like %?1% "
	+ "ORDER BY a.levens desc, a.time", nativeQuery = true)
	Iterable<HighScores> findHighScore(@Param("name") String name);
	@Query(value = "select * from highscores a "
	+ "where a.name = ?1 limit 1", nativeQuery = true)
	HighScores findDup(@Param("name") String name);
	@Transactional
	@Modifying
	@Query(value = "UPDATE highscores set levens = ?2,"
	+ " name = ?3, time = ?4, "
	+ "loser = ?5 where id = ?1", nativeQuery = true)
	void replaceDup(@Param("id") Integer id, @Param("levens")
	Integer levens, @Param("name") String name, 
	@Param("time") Integer time, @Param("loser") String loser);
}
