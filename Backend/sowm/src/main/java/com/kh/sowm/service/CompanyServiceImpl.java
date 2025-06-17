package com.kh.sowm.service;

import com.kh.sowm.dto.CompanyDto;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.Company;
import com.kh.sowm.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    // 회사 신청
    @Override
    public String enrollCompany(CompanyDto.RequestDto enrollCompanyDto) {
        Company company = enrollCompanyDto.enrollCompany();
        companyRepository.save(company);
        return company.getCompanyCode();
    }

}
