package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "DEPARTMENT")
public class Department {
    @Id
    @Column(name = "DEPT_CODE")
    private String deptCode;

    // 직원 디폴트 부서코드 값
    public static Department defaultDepartment() {
        Department dept = new Department();
        dept.deptCode = "D0"; // 부서없음(기타부서)
        return dept;
    }

    // 관리자 디폴트 부서코드 값
    public static Department adminDefaultDepartment() {
        Department dept = new Department();
        dept.deptCode = "A"; // 관리자부서
        return dept;
    }

    @Column(name = "DEPT_NAME")
    private String deptName;
}