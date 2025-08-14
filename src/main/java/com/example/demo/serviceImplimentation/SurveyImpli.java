package com.example.demo.serviceImplimentation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Survey;
import com.example.demo.repository.SurveyRepository;
import com.example.demo.service.SurveyService;

@Service
public class SurveyImpli implements SurveyService{
	
	@Autowired
	SurveyRepository srepo;

	
	@Override
	public Survey createSrvey(Survey survey) {
		
		return srepo.save(survey);
	}

	@Override
	public List<Survey> getAllSurvey() {
		
		return srepo.findAll();
	}

	@Override
	public Survey getSurveyById(int id) {
		
		Optional<Survey>  sur=srepo.findById(id);
		
		return sur.get();
	}

	@Override
	public List<Survey> getSurveyByTitle(String title) {
		
		List<Survey> sr=srepo.findByTitle(title);
		
		return sr;
	}

	@Override
	public void deleteSurveyById(int id) {
		srepo.deleteById(id);
		
	}

	@Override
	public Survey updateSurvey(Survey survey) {
		
		return srepo.save(survey);
	}

}
