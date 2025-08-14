package com.example.demo.dto;

import lombok.Data;

@Data
public class SurveyRequest {

	private String title;
	private String createdBy;
	private Object question;
	
}
