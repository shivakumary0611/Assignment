package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Survey;
import com.example.demo.serviceImplimentation.SurveyImpli;
import com.fasterxml.jackson.core.JsonProcessingException;


@RestController
@RequestMapping("/survey")
public class SurveyController {

	@Autowired
	private SurveyImpli simpli;
	
	@Autowired
	private ModelMapper mm;
	
	
	
	@PostMapping("/save")
	public ResponseEntity<?> createSurvey(@RequestBody Survey survey) throws JsonProcessingException {
	   
		try {
	    Survey savedSurvey = simpli.createSrvey(survey);
	    return ResponseEntity.ok(savedSurvey);
	}catch (Exception e) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "A survey with this title already exists"));
		// TODO: handle exception
	}
		
	}

	
	
	@GetMapping("/getAllSurvey")
	public ResponseEntity<List<Survey>> getAllSurvey(){
		List<Survey> sur=simpli.getAllSurvey();
	return	ResponseEntity.ok(sur);
	}
	
	@GetMapping("/getSurveyById/{id}")
	public ResponseEntity<?> findById(@PathVariable int id) throws Exception{
		Survey survey=simpli.getSurveyById(id);
		if (survey == null) {
	        return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body("Invalid Id: " + id);
	    }
		return ResponseEntity.ok(survey);
	}
	
	@GetMapping("/getBykeyword")
	public ResponseEntity<?>getByTitle(@RequestParam String keyword){
		List<Survey> survey=simpli.getSurveyByKeyword("%" + keyword + "%");;
		System.out.println(keyword);
		for(Survey sur:survey) {
			System.out.println(sur);
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
	    newSurvey.setId(null);
		newSurvey.setStatus("Final");
		newSurvey.setModifiedAt(LocalDateTime.now());
		newSurvey.setVersion(existsurvey.getVersion()+1);
		newSurvey.setSurveyId(existsurvey.getSurveyId());
		System.out.println(newSurvey.getId());
		
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
