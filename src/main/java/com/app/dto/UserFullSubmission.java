package com.app.dto;

import java.util.Date;

public record UserFullSubmission(Long id , String username, String password,
                                 String email, Date birthday, String country,
                                 String oldpassword) {
}
