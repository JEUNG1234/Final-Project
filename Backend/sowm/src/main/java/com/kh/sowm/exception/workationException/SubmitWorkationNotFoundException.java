package com.kh.sowm.exception.workationException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class SubmitWorkationNotFoundException extends BaseException {
    public SubmitWorkationNotFoundException() {super(ErrorCode.SUBMITWORKATION_NOT_FOUND);}

    public SubmitWorkationNotFoundException(String message) {
        super(ErrorCode.SUBMITWORKATION_NOT_FOUND, message);
    }

    public SubmitWorkationNotFoundException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.SUBMITWORKATION_NOT_FOUND, message, cause);
    }
}
