package com.example.firstproject.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String username;
    private String password;
    private String nickname;
    private String upadate_password;
    private String upadate_nickname;

}
