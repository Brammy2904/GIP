package helloWorld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Configuration
@CrossOrigin(origins = "*", allowedHeaders = "*")
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	@Autowired
	WebController cont;
	 @Autowired
	  private SimpMessagingTemplate simpMessagingTemplate;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/websocket").setAllowedOrigins("*").withSockJS().setHttpMessageCacheSize(2);
	}

	@Override
	public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
		registration.setMessageSizeLimit(1024 * 1024);
		registration.setSendBufferSizeLimit(1024 * 1024);
		registration.setSendTimeLimit(2000);

	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.setApplicationDestinationPrefixes("/app");
		registry.enableSimpleBroker("/plane");
		
	}
	
	@EventListener(SessionConnectEvent.class)
	public void handleWebsocketConnectListner(SessionConnectEvent event) {
		System.out.println("Received a new web socket connection");
	}

	@EventListener
	private void onSessionDisconnectEvent(SessionDisconnectEvent event) {
		System.out.println("A user disconnected");
		StompHeaderAccessor connection = StompHeaderAccessor.wrap(event.getMessage());
		int index = cont.array.indexOf((String) connection.getSessionId());
		cont.array.remove(index);
		 simpMessagingTemplate.convertAndSend("/plane/disconnect", "true");
	}

}
