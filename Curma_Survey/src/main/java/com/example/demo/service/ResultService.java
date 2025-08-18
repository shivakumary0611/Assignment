package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Result;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface ResultService {

	Result saveResult(Result result)throws JsonProcessingException;
	List<Result> getAllResult();
	Result  getResultById(int id);
	void deleteResult(int id);
	String convert(Object json)throws JsonProcessingException;
	List<Result> getByKeyword(String keyword);
}
