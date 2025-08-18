package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Result;
import com.example.demo.entity.Survey;
import com.example.demo.serviceImplimentation.ResultImplimentation;
import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/result")
public class ResultController {

	@Autowired
	private ResultImplimentation rimp;
	
	@PostMapping("/save")
	public ResponseEntity<Result> saveResult(@RequestBody Result result) throws JsonProcessingException{
		System.out.println(result);
		Result resultref=rimp.saveResult(result);
		
		return ResponseEntity.ok(resultref);
	}
	
	
	@GetMapping("/allResult")
	public ResponseEntity<List<Result>> getAllResult(){
		
		List<Result> resultList=rimp.getAllResult();
		return ResponseEntity.ok(resultList);
	}
	
	@GetMapping("/getById/{id}")
	public ResponseEntity<?> getResultById(@PathVariable int id){
		Result ref=rimp.getResultById(id);
		if(ref==null)
		{
		 return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inavid Id");	
		}	
		
		return ResponseEntity.ok(ref);
		}
	
	@GetMapping("/getByKeyword")
	public ResponseEntity<?> getByKeyword(@RequestParam String keyword){

		List<Result> result=rimp.getByKeyword(keyword);

		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping("/deleteById/{id}")
	public ResponseEntity<?> deleteResultById(@PathVariable int id){
		Result ref=rimp.getResultById(id);
		if(ref==null)
		{
		 return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inavid Id");	
		}	
		rimp.deleteResult(id);
		return ResponseEntity.ok("Survey deleted successfully");
	}
	
}
