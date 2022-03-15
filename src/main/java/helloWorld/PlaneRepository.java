package helloWorld;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PlaneRepository extends CrudRepository<Plane, Integer> {

	@Query(value = "Select * from plane1", nativeQuery = true)
	Iterable<Plane> getAllPlane();

	
}
