package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Result;

public interface ResultRepository  extends JpaRepository<Result, Integer>{
	
	

}
