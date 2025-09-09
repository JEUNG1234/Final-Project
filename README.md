# SOWM
- AI 기반 디지털 헬스케어 연동 스마트 복지 ERP 시스템

## 프로젝트 개요
- 개발 기간: 2025-05-26 ~ 2025-07-18
- 목적 : 직원의 건강관리와 업무 효율성을 높이기 위한 사내 건강 중심 ERP 플랫폼 구축
- 역할 : 이슈관리자 / 프론트엔드 및 백엔드 주요 기능 구현 AWS S3 업로드 기능/ 투표•챌린지 생성,참여,관리 / 메인페이지 정보 표시 기능
## 시연 영상 링크
[![프로젝트 데모](https://img.youtube.com/vi/GDLgoM2Afsw/hqdefault.jpg)](https://youtu.be/GDLgoM2Afsw)


## 기술 스택  
`Front-End`  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
<img src="https://img.shields.io/badge/styledcomponents-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white"/>
<img src="https://img.shields.io/badge/ReactHookForm-EC5990?style=flat-square&logo=ReactHookForm&logoColor=white"/>

`DB`<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>

`Back-end`  <img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=OpenJDK&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring-6DB33F?style=flat-square&logo=Spring&logoColor=white"/>
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=SpringBoot&logoColor=white"/>
<img src="https://img.shields.io/badge/JPA-59666C?style=flat-square&logo=Hibernate&logoColor=white"/>



`Communication`  <img src="https://img.shields.io/badge/notion-000000?style=flat-square&logo=notion&logoColor=white"/>
<img src="https://img.shields.io/badge/github-181717?style=flat-square&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/trello-0052CC?style=flat-square&logo=trello&logoColor=white"/>
<img src="https://img.shields.io/badge/postman-FF6C37?style=flat-square&logo=postman&logoColor=white"/>
<img src="https://img.shields.io/badge/discord-5865F2?style=flat-square&logo=discord&logoColor=white"/>


## 사용 라이브러리 및 API
- **JWT**: 사용자 인증 및 세션 관리를 위해 사용  
- **OpenAI API**: 심리검사 및 AI 기반 기능 구현  
- **Axios**: 프론트엔드에서 HTTP 요청 처리  
- **React Hook Form**: 효율적인 폼 상태 관리 및 유효성 검사  
- **Spring Security**: 백엔드 보안 및 인증 관리  
- **Naver Maps API**: 지도 및 위치 기반 서비스 구현  

### 3. 담당 역할 및 구현 기능

| 분류       | 상세 내용                                                                 |
|------------|--------------------------------------------------------------------------|
|이슈관리 및 의견조율| 회의 내용 정리 및 이슈 정리를 통한 기능관련 아이디어제공           |
| 투표 시스템 | 관리자의 투표 관리 시스템, 직원의 투표 참여기능 구현                      |
| 챌린지 시스템| 투표결과로부터 챌린지 생성 및 관리, 현재 참여중인 챌린지 현황 기능 구현  |
| 마이페이지  | 프로필 조회 및 휴가 및 포인트전환 기능(포인트 -> 휴가 전환) 구현          |
| 대시보드   | 관리자/직원별 맞춤 대시보드 (근태 요약, 그래프 시각화, 일정현황표시 등)    |


## 설치 및 실행 방법
```bash

git clone https://github.com/d5ngjun2/Final-Project.git
cd Final-Project

# 프론트
cd React
npm install
npm start

# 백엔드
cd BackEnd
./gradlew bootRun

## 주요 기능
- 회원가입 및 로그인 (JWT 기반)
- 인력관리
- 일정관리
- 근태관리
- 자유게시판
- OpenAI API 를 활용한 심리검사 및 신체검사 테스트
- 투표
- 챌린지 기능

## 팀원 소개

| 이름 | 포지션,역할 | Contact |
| 황동준 | 팀장, 일정관리 | nikihwangg@ivycomtech.com |
| 정민구 | 이슈관리 | a1@gmail.com |
| 홍승민 | 형상관리 | a1@gmail.com |
| 황윤창 | DB관리 | a1@gmail.com |
