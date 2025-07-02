package com.kh.sowm.exception.usersException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class UserAleadyExistsException extends BaseException {
    public UserAleadyExistsException() {
        super(ErrorCode.USER_ALREADY_EXISTS);
    }

    public UserAleadyExistsException(String message) {
        super(ErrorCode.USER_ALREADY_EXISTS, message);
    }

    public UserAleadyExistsException(String message, Throwable cause) {
        super(ErrorCode.USER_ALREADY_EXISTS, message, cause);
    }
}
