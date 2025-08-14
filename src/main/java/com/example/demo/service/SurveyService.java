package com.example.demo.service;


import java.util.List;

import com.example.demo.entity.Survey;

public interface SurveyService {

	Survey createSrvey(Survey survey);
	List<Survey> getAllSurvey();
	Survey getSurveyById(int id);
	List<Survey> getSurveyByTitle(String title);
	void deleteSurveyById(int id);
	Survey updateSurvey(Survey survey);
	
	
	
}
