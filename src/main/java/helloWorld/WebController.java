package helloWorld;

import java.time.LocalDate;
import java.util.HashMap;
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
	@MessageMapping("/plane/1")
	@SendTo("/plane/coords/1")
	public String getCoords(@RequestBody String coords){
	    return coords;
	   
	}
	@MessageMapping("/plane/shoot/1")
	@SendTo("/plane/shoot1")
	public String shoot1(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/boost/1")
	@SendTo("/plane/boost1")
	public String boost1(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/2")
	@SendTo("/plane/coords/2")
	public String getCoords2(@RequestBody String coords){
	    return coords;
	   
	}
	@MessageMapping("/plane/shoot/2")
	@SendTo("/plane/shoot2")
	public String shoot2(@RequestBody String test){
	    return test;
	   
	}
	@MessageMapping("/plane/boost/2")
	@SendTo("/plane/boost2")
	public String boost2(@RequestBody String test){
	    return test;
	   
	}
}
