package com.example.quizzlet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class QuizzletApplication {

	public static void main(String[] args) {

		SpringApplication.run(QuizzletApplication.class, args);
	}

}
