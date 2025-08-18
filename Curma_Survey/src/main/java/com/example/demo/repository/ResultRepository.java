package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.Result;

public interface ResultRepository  extends JpaRepository<Result, Integer>{
	
 List<Result> findByTitle(String title);

}
