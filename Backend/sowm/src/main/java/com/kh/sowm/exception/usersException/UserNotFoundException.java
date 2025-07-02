package com.kh.sowm.exception.usersException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class UserNotFoundException extends BaseException {
    public UserNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND);
    }

    public UserNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }

    public UserNotFoundException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.USER_NOT_FOUND, message, cause);
    }
}
