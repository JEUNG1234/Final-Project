package com.kh.sowm.exception.workationException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class WorkationEnrollException extends BaseException {


    public WorkationEnrollException() {super(ErrorCode.WORKATION_SAVE_ERROR);}

    public WorkationEnrollException(String message) {
        super(ErrorCode.WORKATION_SAVE_ERROR, message);
    }

    public WorkationEnrollException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.WORKATION_SAVE_ERROR, message, cause);
    }
}
