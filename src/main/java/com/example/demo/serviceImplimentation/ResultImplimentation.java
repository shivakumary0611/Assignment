package com.example.demo.serviceImplimentation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Result;
import com.example.demo.repository.ResultRepository;
import com.example.demo.service.ResultService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ResultImplimentation implements ResultService{

	@Autowired
	private ResultRepository rrepo;

	@Override
	public List<Result> getAllResult() {
		return rrepo.findAll();
	}

	@Override
	public Result getResultById(int id) {
		Optional<Result> ref=rrepo.findById(id);
		return ref.get();
	}

	@Override
	public void deleteResult(int id) {
		rrepo.deleteById(id);
		
	}

	@Override
	public Result saveResult(Result result) throws JsonProcessingException{
		result.setResponse(convert(result.getResponse()));
		
		return rrepo.save(result);
	}

	@Override
	public String convert(Object json) throws JsonProcessingException {
		ObjectMapper mapper=new ObjectMapper();
		return mapper.writeValueAsString(json);
	}
	
	
	
	
	
}
