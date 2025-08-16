package com.example.demo.serviceImplimentation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Survey;
import com.example.demo.repository.SurveyRepository;
import com.example.demo.service.SurveyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SurveyImpli implements SurveyService{
	
	@Autowired
	SurveyRepository srepo;

	
	@Override
	public Survey createSrvey(Survey survey) throws JsonProcessingException {
		
		 	survey.setStatus("Draft");
		    survey.setVersion(1);
		    survey.setCreatedAt(LocalDateTime.now());
		    survey.setVersion(1);
		    Random random=new Random();
		    survey.setSurveyId(random.nextInt(1234)+1);
		   
		    survey.setQuestion(convert(survey.getQuestion()));

		return srepo.save(survey);
	}

	@Override
	public List<Survey> getAllSurvey() {
		
		return srepo.findAll();
	}

	@Override
	public Survey getSurveyById(int id){
		
		Optional<Survey>  sur=srepo.findById(id);
		
		return sur.get();
	}



	@Override
	public void deleteSurveyById(int id) {
		srepo.deleteById(id);
		
	}

	@Override
	public Survey updateSurvey(Survey survey) {
		
		return srepo.save(survey);
	}

	@Override
	public String convert(Object json) throws JsonProcessingException {
		ObjectMapper mapper=new ObjectMapper();
		return mapper.writeValueAsString(json);
	}

	@Override
	public List<Survey> getSurveyByKeyword(String keyword) {
		
		return srepo.findByKeyword(keyword);
	}

	

}
