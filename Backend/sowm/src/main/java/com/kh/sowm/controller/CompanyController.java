package com.kh.sowm.controller;

import com.kh.sowm.dto.CompanyDto;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CompanyController {
    private final CompanyService companyService;


    @PostMapping("/enrollcompany")
    public ResponseEntity<String> enrollCompany(@RequestBody CompanyDto.RequestDto enrollCompanyDto) {
        String result = companyService.enrollCompany(enrollCompanyDto);  // 서비스도 Company 기준
        System.out.println(result);
        return ResponseEntity.ok(result);
    }
}
