package com.kh.sowm.exception.usersException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class CompanyNotFoundException extends BaseException {

    public CompanyNotFoundException() {
        super(ErrorCode.COMPANY_NOT_FOUND);
    }

    public CompanyNotFoundException(String message) {
        super(ErrorCode.COMPANY_NOT_FOUND, message);
    }

    public CompanyNotFoundException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.COMPANY_NOT_FOUND, message, cause);
    }
}
