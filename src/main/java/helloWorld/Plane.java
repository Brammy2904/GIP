package helloWorld;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity(name = "plane")
public class Plane {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	public Integer Id;

	@Column(name = "hp")
	public Integer hp;
	
	@Column(name="name")
	public String name;
	
	
	public void setHp(Integer hp) {
		this.hp = hp;
	}
	public void setName(String name) {
		this.name = name;
	}
}
