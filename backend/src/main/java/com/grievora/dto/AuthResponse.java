package com.grievora.dto;

public class AuthResponse {
    private String message;
    private UserDto user;
    private String redirectUrl;

    public AuthResponse() {}

    public AuthResponse(String message, UserDto user, String redirectUrl) {
        this.message = message;
        this.user = user;
        this.redirectUrl = redirectUrl;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public String getRedirectUrl() { return redirectUrl; }
    public void setRedirectUrl(String redirectUrl) { this.redirectUrl = redirectUrl; }
}
