package com.kh.sowm.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    //사용자 관련 에러
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    INVALID_USER_INPUT(HttpStatus.BAD_REQUEST, "사용자 입력값이 올바르지 않습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),

    //회사 관련 에러
    COMPANY_NOT_FOUND(HttpStatus.NOT_FOUND, "회사코드를 조회할 수 없습니다."),

    //워케이션 관련 에러
    WORKATION_NOT_FOUND(HttpStatus.NOT_FOUND, "워케이션 정보를 조회할 수 없습니다."),
    SUBMITWORKATION_NOT_FOUND(HttpStatus.NOT_FOUND, "신청 내역을 찾을 수 없습니다."),
    WORKATION_SAVE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "워케이션 저장 중 오류가 발생했습니다."),

    // 투표 관련 에러
    VOTE_CANNOT_BE_DELETED(HttpStatus.BAD_REQUEST, "진행중인 챌린지가 있어 삭제가 불가능합니다."),


    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
    REQUEST_TIMEOUT(HttpStatus.REQUEST_TIMEOUT, "요청 시간 초과되었습니다.");

    private final HttpStatus status;
    private final String message;
}