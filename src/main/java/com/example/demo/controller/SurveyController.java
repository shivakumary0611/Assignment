package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.SurveyRequest;
import com.example.demo.entity.Survey;
import com.example.demo.serviceImplimentation.SurveyImpli;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/survey")
public class SurveyController {

	@Autowired
	private SurveyImpli simpli;
	
	@Autowired
	private ModelMapper mm;
	
	@PostMapping("/save")
	public ResponseEntity<Survey> createSurvey(@RequestBody SurveyRequest surveyRequest) throws JsonProcessingException{
		Survey survey=new Survey();
		survey.setStatus("Draft");
		survey.setVersion(1);
		survey.setCreatedAt(LocalDateTime.now());
		Random random=new Random();
		survey.setSurveyId(random.nextInt(1111)+1);
		survey.setTitle(surveyRequest.getTitle());
		survey.setCreatedBy(surveyRequest.getCreatedBy());
		
		
		ObjectMapper map=new ObjectMapper();
		String question= map.writeValueAsString(surveyRequest.getQuestion());
		
		survey.setQuestion(question);
		
		Survey survey1=simpli.createSrvey(survey);
		
		
		
		return ResponseEntity.ok(survey1);
	}
	
	@GetMapping("/getAllSurvey")
	public ResponseEntity<List<Survey>> getAllSurvey(){
		List<Survey> sur=simpli.getAllSurvey();
	return	ResponseEntity.ok(sur);
	}
	
	@GetMapping("/getSurveyById/{id}")
	public ResponseEntity<?> findById(@PathVariable int id){
		Survey survey=simpli.getSurveyById(id);
		if (survey == null) {
	        return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body("Invalid Id: " + id);
	    }
		return ResponseEntity.ok(survey);
	}
	
	@GetMapping("/getByTitle/{title}")
	public ResponseEntity<?>getByTitle(@PathVariable String title){
		List<Survey> survey=simpli.getSurveyByTitle(title);
		if (survey == null) {
	        return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body("Invalid title: " + title);
	    }
		return ResponseEntity.ok(survey);
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateSurvey(@RequestBody Survey surveyRequest){
		 
		Survey existsurvey=simpli.getSurveyById(surveyRequest.getId());
		
		
		if (existsurvey== null) {
	        return ResponseEntity
	                .status(HttpStatus.NOT_FOUND).body("Survey not found");
	    }
		
       existsurvey.setStatus("Overridden");
       existsurvey.setModifiedAt(LocalDateTime.now());
       simpli.updateSurvey(existsurvey);
		
		Survey newSurvey=new Survey();
		
	    mm.map(surveyRequest,newSurvey);	
		newSurvey.setStatus("Final");
		newSurvey.setModifiedAt(LocalDateTime.now());
		
		
		newSurvey.setVersion(existsurvey.getVersion()+1);
		
		Survey updatedSurvey=simpli.updateSurvey(newSurvey);
		
		return ResponseEntity.ok(updatedSurvey);
	}
	
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteSurvey(@PathVariable int id) {
	    Survey existingSurvey = simpli.getSurveyById(id);
	    if (existingSurvey == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Survey not found");
	    }
	    simpli.deleteSurveyById(id);
	    return ResponseEntity.ok("Survey deleted successfully");
	}
	
	
	
}
