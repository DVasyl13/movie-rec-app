package com.app.controller;

import com.app.dto.UserFullSubmission;
import com.app.dto.UserSubmission;
import com.app.entity.User;
import com.app.service.UserService;
import com.app.util.ResponseHandler;
import com.app.util.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<Object> login(@RequestBody UserSubmission userSubmission) {
        User user = userService.authenticateUser(userSubmission.email(), userSubmission.password());
        return ResponseHandler.generateResponse(
                "Login is successful",
                HttpStatus.OK,
                UserMapper.mapUserIntoUsersMovieDto(user));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Object> registration(@RequestBody UserFullSubmission userSubmission) {
        User user = userService.saveUser(userSubmission);
        return ResponseHandler.generateResponse(
                "Account has been created",
                HttpStatus.OK,
                UserMapper.mapUserIntoUsersMovieDto(user));
    }
}
