package com.kh.sowm.controller;

import com.kh.sowm.dto.MedicalCheckDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalResultDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalResultDto;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.service.HealthService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    // 심리검사 테스트 전송
    @PostMapping("/mentalquestion")
    public ResponseEntity<MedicalCheckDto.MentalQuestionDto> askQuestions(
            @RequestBody MedicalCheckDto.MentalQuestionRequestDto requestDto) {

        MentalQuestionDto result = healthService.getMentalQuestion(requestDto, requestDto.getUserId());
        System.out.println("전송한 아이디 : " + requestDto.getUserId());
        return ResponseEntity.ok(result);
    }

    // 테스트한 결과 프론트로 출력
    @GetMapping("/mentalquestion/result")
    public ResponseEntity<MedicalCheckDto.MentalResultDto> getMentalCheckResult(@RequestParam String userId) {
        MentalResultDto result = healthService.getMentalCheckResult(userId);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/physicalquestion")
    public ResponseEntity<MedicalCheckDto.PhysicalQuestionDto> askQuestions(
            @RequestBody MedicalCheckDto.PhysicalQuestionRequestDto requestDto) {

        PhysicalQuestionDto result = healthService.getPhysicalQuestion(requestDto, requestDto.getUserId());
        System.out.println("전송한 아이디 : " + requestDto.getUserId());
        return ResponseEntity.ok(result);
    }

    // 테스트한 결과 프론트로 출력
    @GetMapping("/physicalquestion/result")
    public ResponseEntity<MedicalCheckDto.PhysicalResultDto> getPhysicalCheckResult(@RequestParam String userId) {
        PhysicalResultDto result = healthService.getPhysicalCheckResult(userId);
        return ResponseEntity.ok(result);
    }

}
