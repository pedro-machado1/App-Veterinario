package com.service.exceptions;

public class PermissionException extends RuntimeException {
    public PermissionException(String message) {
        super(message);
    }
}
