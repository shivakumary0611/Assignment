package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Survey;

@Repository
public interface SurveyRepository  extends JpaRepository<Survey, Integer>{

	

	@Query(value = "SELECT * FROM SURVEY WHERE STATUS LIKE :keyword OR TITLE LIKE :keyword", nativeQuery = true)
	List<Survey> findByKeyword(@Param("keyword") String keyword);


	
}
