package com.kh.sowm.exception.workationException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class WorkationNotFountException extends BaseException {
    public WorkationNotFountException() {super(ErrorCode.WORKATION_NOT_FOUND);}

  public WorkationNotFountException(String message) {
    super(ErrorCode.WORKATION_NOT_FOUND, message);
  }

  public WorkationNotFountException(ErrorCode errorCode, String message, Throwable cause) {
    super(ErrorCode.WORKATION_NOT_FOUND, message, cause);
  }
}
