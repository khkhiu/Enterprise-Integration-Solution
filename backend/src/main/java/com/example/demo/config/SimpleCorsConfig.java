package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class SimpleCorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://frontend:5173") // Add your frontend origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")      // Allow necessary HTTP methods
                .allowedHeaders("*")                                           // Allow all headers
                .allowCredentials(true);                                       // Allow credentials
    }
}