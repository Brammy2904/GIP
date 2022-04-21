package helloWorld;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
public class WebController {
	List<String> array = new ArrayList<String>();
	String image = null;
	@MessageMapping("/plane/move1")
	@SendTo("/plane/coords")
	public String getCoords(@RequestBody String coords){
	    return coords;
	   
	}
	@MessageMapping("/plane/shoot/1")
	@SendTo("/plane/shoot")
	public String shoot1(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/boost/1")
	@SendTo("/plane/boost")
	public String boost1(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/name")
	@SendTo("/plane/name/test")
	public Integer name(@RequestBody String test){
		if(array.size() >= 2) {
			return 0;
		}
		array.add(test);
	    return array.size();
	   
	}
	@MessageMapping("/plane/move2")
	@SendTo("/plane/coordsing")
	public String getCoords2(@RequestBody String coords){
	    return coords;
	   
	}
	@MessageMapping("/plane/image")
	@SendTo("/plane/image/settings")
	public String getImage(@RequestBody String coords){
		if(image == null) {
			image = coords;
			coords = "["+coords+"]";
		}
		else if(image != null) {
			if((image.contains("player1") && coords.contains("player1")) ||(image.contains("player2") && coords.contains("player2")) ) {
				coords = "["+coords+"]";
				image = null;
			}
			else {
			coords = "["+coords +","+ image+"]";
			image = null;
			}
		}
	    return coords;
	   
	}
	@MessageMapping("/plane/shoot/2")
	@SendTo("/plane/shooting")
	public String shoot2(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/boost/2")
	@SendTo("/plane/boosting")
	public String boost2(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/won")
	@SendTo("/plane/winner")
	public String winner(@RequestBody String test){
	    return test;
	   
	}
}
