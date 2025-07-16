package com.kh.sowm.exception.voteException;

import com.kh.sowm.exception.BaseException;
import com.kh.sowm.exception.ErrorCode;

public class VotePermissionException extends BaseException {
    public VotePermissionException() {
        super(ErrorCode.VOTE_PERMISSION_DENIED);
    }

    public VotePermissionException(String message) {
        super(ErrorCode.VOTE_PERMISSION_DENIED, message);
    }

    public VotePermissionException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.VOTE_PERMISSION_DENIED, message, cause);
    }
}