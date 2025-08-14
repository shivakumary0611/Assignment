package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Survey;

@Repository
public interface SurveyRepository  extends JpaRepository<Survey, Integer>{

	

	
	List<Survey> findByTitle(String title);

	
}
