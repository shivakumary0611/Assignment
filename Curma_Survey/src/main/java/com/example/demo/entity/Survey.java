package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;



@Entity
@Data
public class Survey{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private int surveyId;
	private String title;
	private String createdBy;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	
	@Column(columnDefinition = "TEXT")
	private Object question;
	
	private int version;
	private String status;
	
}
