package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Result;
import com.example.demo.serviceImplimentation.ResultImplimentation;

@RestController
@RequestMapping("/result")
public class ResultController {

	@Autowired
	private ResultImplimentation rimp;
	
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
