package com.healthcare.healthcare_system.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${app.api.url:http://localhost:8080}")
    private String apiUrl;

    @Bean
    public OpenAPI healthcareOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Healthcare System API")
                        .description("""
                                REST API documentation for the Healthcare Management System.
                                
                                **Roles:**
                                - **Patient** – Register, search hospitals, book/cancel/reschedule appointments
                                - **Doctor** – Manage profile, create slots, view upcoming appointments
                                - **Admin** – Approve/reject doctors, manage hospitals, view all appointments
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Healthcare System")
                                .email("admin@healthcare.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")))
                .servers(List.of(
                        new Server()
                                .url(apiUrl)
                                .description("API Server URL")
                ));
    }
}
