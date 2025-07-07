package com.kh.sowm.exception.usersException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class UserAlreadyExistsException extends BaseException {
    public UserAlreadyExistsException() {
        super(ErrorCode.USER_ALREADY_EXISTS);
    }

    public UserAlreadyExistsException(String message) {
        super(ErrorCode.USER_ALREADY_EXISTS, message);
    }

    public UserAlreadyExistsException(ErrorCode errorCode) {
        super(errorCode);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(ErrorCode.USER_ALREADY_EXISTS, message, cause);
    }
}