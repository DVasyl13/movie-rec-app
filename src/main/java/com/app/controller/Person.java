package com.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/person")
@RequiredArgsConstructor
public class Person {

    @GetMapping
    @RequestMapping("/{id}")
    public String getPersonPage(@PathVariable("id") String id) {
        return "person";
    }
}
