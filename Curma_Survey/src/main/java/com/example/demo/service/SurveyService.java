package com.example.demo.service;


import java.util.List;

import com.example.demo.entity.Survey;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface SurveyService {

	Survey createSrvey(Survey survey)throws Exception;
	List<Survey> getAllSurvey();
	Survey getSurveyById(int id);
	void deleteSurveyById(int id);
	Survey updateSurvey(Survey survey);
	String convert(Object json)throws JsonProcessingException;
	List<Survey> getSurveyByKeyword(String keyword);
	Survey findByTitle(String title);
	
	
}
