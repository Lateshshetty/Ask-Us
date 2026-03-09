package com.example.Ask.us.Repo;

import com.example.Ask.us.Module.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface repo extends MongoRepository<Users, Integer> {
    Users findByName(String name);
    Users findByEmail(String email);
}
