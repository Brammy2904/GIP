package helloWorld;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Configuration
public class ConfigurationClass {
    @Bean
    public TomcatServletWebServerFactory tomcatServletWebServerFactory(){
        TomcatServletWebServerFactory tomcatServletWebServerFactory = new TomcatServletWebServerFactory();
        tomcatServletWebServerFactory.addConnectorCustomizers((Connector connector) -> {
            connector.setProperty("relaxedPathChars","\"{\\}^`{|}");
            connector.setProperty("relaxedQueryChars","\"{\\}^`{|}");
        });
        return tomcatServletWebServerFactory;
    }
}
