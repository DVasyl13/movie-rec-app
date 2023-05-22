package com.app.controller.api;

import com.app.dto.UserPutDto;
import com.app.service.UserService;
import com.app.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    @PutMapping
    @RequestMapping("/liked")
    public ResponseEntity<Object> doToggleToLiked(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserLikedMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }

    @PutMapping
    @RequestMapping("/ignored")
    public ResponseEntity<Object> doToggleToIgnored(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserIgnoredMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }

    @PutMapping
    @RequestMapping("/watched")
    public ResponseEntity<Object> doToggleToWatched(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserWatchedMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }
}
