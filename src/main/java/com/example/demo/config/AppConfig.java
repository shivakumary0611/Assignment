package com.example.demo.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
    	
        ModelMapper mm= new ModelMapper();
        mm.getConfiguration().setSkipNullEnabled(true);
        
        return mm;
    }
}
