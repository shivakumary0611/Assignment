package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.NumberToWordsService;

@RestController
@RequestMapping("/numberGame")
public class NumberToWordsController {

	@Autowired
    private NumberToWordsService service;

    @GetMapping("/convert/{num}")
    public String convertNumber(@PathVariable long num) {
        return service.convert(num);
    }
	
}
