package com.validarticle.main.controller;

import com.validarticle.main.model.User;
import com.validarticle.main.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class ApiBasicOperations {

    private UserRepository UserRepository;


    public ApiBasicOperations(com.validarticle.main.repository.UserRepository userRepository) {
        this.UserRepository = userRepository;
    }


    /**
     * Performs a search for a given user id
     *
     * @param model    the data to send to the view
     * @param id       the users id
     * @return template name
     */
    @GetMapping("/api/getUser/{id}")
    public User getUserByUserId(Map<String, Object> model, @PathVariable String id) {
        System.out.println(id);
        return UserRepository.getUserById(id);
    }
}