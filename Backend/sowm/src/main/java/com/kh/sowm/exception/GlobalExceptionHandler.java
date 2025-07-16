package com.kh.sowm.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    //BaseException및 그 하위예외처리
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex, HttpServletRequest request) {
        log.error("BaseException 발생 : {}", ex.getMessage(), ex);
        ErrorResponse error = ErrorResponse.of(ex.getErrorCode(), request.getRequestURI());
        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(error);
    }

    //404에러처리
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex,
                                                                       HttpServletRequest request) {
        log.error("핸드러를 찾을 수 없음 : {}", ex.getMessage());

        ErrorResponse error = ErrorResponse.of(ErrorCode.RESOURCE_NOT_FOUND, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // IllegalStateException 처리 추가
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex,
                                                            HttpServletRequest request) {
        log.error("부적절한 상태: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), request.getRequestURI());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
                                                               HttpServletRequest request) {
        log.error("잘못된 인수 : {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(ErrorCode.INVALID_USER_INPUT, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.badRequest().body(error);
    }
}