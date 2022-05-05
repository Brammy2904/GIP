package helloWorld;

import java.util.ArrayList;
import org.json.*;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
public class WebController {
	List<String> array = new ArrayList<String>();
	String image = null;
	@Autowired
	AddToDb add;
	@Autowired
	HScoresRepository HscoreRep;

	
	@MessageMapping("/plane/move1")
	@SendTo("/plane/coords")
	public String getCoords(@RequestBody String coords) {
		return coords;

	}

	@MessageMapping("/plane/shoot/1")
	@SendTo("/plane/shoot")
	public String shoot1(@RequestBody String test) {
		return test;

	}

	@MessageMapping("/plane/boost/1")
	@SendTo("/plane/boost")
	public String boost1(@RequestBody String test) {
		return test;

	}

	@MessageMapping("/plane/name")
	@SendTo("/plane/name/test")
	public Integer name(@RequestBody String test) {
		if (array.size() >= 2) {
			return 0;
		}
		array.add(test);
		return array.size();

	}

	@MessageMapping("/plane/move2")
	@SendTo("/plane/coordsing")
	public String getCoords2(@RequestBody String coords) {
		return coords;

	}

	@MessageMapping("/plane/image")
	@SendTo("/plane/image/settings")
	public String getImage(@RequestBody String coords) {
		if (image == null) {
			image = coords;
			coords = "[" + coords + "]";
		} else if (image != null) {
			if ((image.contains("player1") && coords.contains("player1"))
					|| (image.contains("player2") && coords.contains("player2"))) {
				coords = "[" + coords + "]";
				image = null;
			} else {
				coords = "[" + coords + "," + image + "]";
				image = null;
			}
		}
		return coords;

	}

	@MessageMapping("/plane/shoot/2")
	@SendTo("/plane/shooting")
	public String shoot2(@RequestBody String test) {
		return test;

	}

	@MessageMapping("/plane/boost/2")
	@SendTo("/plane/boosting")
	public String boost2(@RequestBody String test) {
		return test;

	}

	@MessageMapping("/plane/won")
	@SendTo("/plane/winner")
	public String winner(@RequestBody String test) {
		return test;

	}

	@MessageMapping("/plane/send/hscore")
	public void HScore(@RequestBody String test) {
		boolean voegToe = true;
		JSONObject obj = new JSONObject(test);
		HighScores high1 = HscoreRep.findDup(obj.getString("name"));
		Integer id = null;
		boolean higher = false;
		if(voegToe) {
		if(high1 != null) {
		id = high1.id;
		higher = high1.levens < obj.getInt("levens");
		}
		else {
			System.out.println("Geen dup");
		}
		if (id != null && higher) {
			HscoreRep.replaceDup(id, obj.getInt("levens"), obj.getString("name"), obj.getInt("time"), obj.getString("loser"));

		} else {
		add.initHScore(obj.getInt("levens"), obj.getString("name"),obj.getInt("time"), obj.getString("loser"));
		}
		}
	}
	@MessageMapping("/plane/lifes")
	@SendTo("/plane/spawn")
	public String Lifes(@RequestBody String test) {
		JSONObject obj = new JSONObject(test);
	Integer left = new Random().nextInt(10, 90);
	Integer top = new Random().nextInt(10, 90);
	JSONObject coordin = new JSONObject();
	coordin.put("left", left);
	coordin.put("top", top);
	
		return coordin.toString();

	}
	@MessageMapping("/plane/life/add")
	@SendTo("/plane/life")
	public String Life(@RequestBody String test) {
		return test;
	}
}
