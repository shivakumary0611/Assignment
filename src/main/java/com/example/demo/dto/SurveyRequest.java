package com.example.demo.dto;

import java.util.Map;

import lombok.Data;


@Data
public class SurveyRequest {

	private String title;
	private String createdBy;
	private Map<String,Object> question;
	
}
