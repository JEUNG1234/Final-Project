package com.kh.sowm.exception.usersException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class CompanyDisagreementException extends BaseException {


    public CompanyDisagreementException() {
        super(ErrorCode.COMPANY_DISAGREEMENT);
    }

    public CompanyDisagreementException(String message) {
        super(ErrorCode.COMPANY_DISAGREEMENT, message);
    }

    public CompanyDisagreementException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.COMPANY_DISAGREEMENT, message, cause);
    }
}
