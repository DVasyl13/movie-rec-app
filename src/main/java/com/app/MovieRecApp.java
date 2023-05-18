package com.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@Slf4j
@EnableScheduling
@EnableCaching
@SpringBootApplication
public class MovieRecApp {

	public static void main(String[] args) {
		SpringApplication.run(MovieRecApp.class, args);
	}

}
