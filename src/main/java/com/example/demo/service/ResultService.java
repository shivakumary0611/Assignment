package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Result;

public interface ResultService {

	List<Result> getAllResult();
	Result  getResultById(int id);
	void deleteResult(int id);
}
