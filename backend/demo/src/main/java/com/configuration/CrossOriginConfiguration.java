package com.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossOriginConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply CORS to your API endpoints
                .allowedOrigins("http://localhost:5173") // Allow requests from your frontend origin
                .allowedMethods("GET", "POST", "PUT", "DELETE"); // Allow the necessary HTTP methods
    }
}


