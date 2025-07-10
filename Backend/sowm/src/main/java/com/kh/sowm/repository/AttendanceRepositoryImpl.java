package com.kh.sowm.repository;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.dto.AttendanceDto.WeeklyAttendanceDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.enums.CommonEnums.AttendanceStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Repository
public class AttendanceRepositoryImpl implements AttendanceRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public boolean existsByUserAndAttendTimeBetween(User user, LocalDateTime today, LocalDateTime tomorrow) {
        String jpql = "SELECT COUNT(a) FROM Attendance a " +
                "WHERE a.user = :user " +
                "AND a.attendTime >= :todayStart " +
                "AND a.attendTime < :tomorrowStart";

        Long count = em.createQuery(jpql, Long.class)
                .setParameter("user", user)
                .setParameter("todayStart", today)
                .setParameter("tomorrowStart", tomorrow)
                .getSingleResult();

        return count > 0;
    }

    @Override
    public void save(Attendance attendance) {
        em.persist(attendance);
    }

    @Override
    public List<Attendance> findUserAttendanceStatus(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart) {
        String jpql = "SELECT a FROM Attendance a " +
                "WHERE a.user = :user " +
                "AND a.attendTime >= :todayStart " +
                "AND a.attendTime < :tomorrowStart " +
                "ORDER BY a.attendTime DESC"; // 최신 기록이 먼저 오도록 내림차순 정렬

        return em.createQuery(jpql, Attendance.class)
                .setParameter("user", user)
                .setParameter("todayStart", todayStart)
                .setParameter("tomorrowStart", tomorrowStart)
                .getResultList();
    }

    @Override
    public Optional<Attendance> findLastClockInRecord(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart, CommonEnums.AttendanceStatus attendanceStatus) {
        String jpql = "SELECT a FROM Attendance a " +
                "WHERE a.user = :user " +
                "AND a.attendTime >= :todayStart " +
                "AND a.attendTime < :tomorrowStart " +
                "AND a.status = :status " +
                "ORDER BY a.attendTime DESC";

        return em.createQuery(jpql, Attendance.class)
                .setParameter("user", user)
                .setParameter("todayStart", todayStart)
                .setParameter("tomorrowStart", tomorrowStart)
                .setParameter("status", attendanceStatus)
                .setMaxResults(1)
                .getResultList()
                .stream()
                .findFirst();
    }


    @Override
    public List<Attendance> findByUserId(String userId) {

        return em.createQuery(
                        "SELECT a FROM Attendance a WHERE a.user.userId = :userId ORDER BY a.attendTime DESC",
                        Attendance.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public List<AttendanceDto.Record> getAllAttendanceByCompany(String companyCode) {

        List<Attendance> list = em.createQuery(
                        "SELECT a FROM Attendance a "
                                + "JOIN a.user u "
                                + "JOIN u.company c "
                                + "WHERE c.companyCode = :companyCode", Attendance.class)
                .setParameter("companyCode", companyCode)
                .getResultList();

        return AttendanceDto.Record.toEntity(list);
    }

    @Override
    public List<AttendanceDto.Record> getTodayAttendance(String companyCode) {

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();             // 오늘 00:00:00
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay(); // 내일 00:00:00

        List<Attendance> list = em.createQuery(
                        "SELECT a FROM Attendance a " +
                                "JOIN a.user u " +
                                "JOIN u.company c " +
                                "WHERE c.companyCode = :companyCode " +
                                "AND a.attendTime >= :startOfDay " +
                                "AND a.attendTime < :startOfTomorrow", Attendance.class)
                .setParameter("companyCode", companyCode)
                .setParameter("startOfDay", startOfDay)
                .setParameter("startOfTomorrow", startOfTomorrow)
                .getResultList();

        return AttendanceDto.Record.toEntity(list);
    }

    @Override
    public Optional<Attendance> findById(Long attendanceNo) {
        Attendance attendance = em.find(Attendance.class, attendanceNo);
        return Optional.ofNullable(attendance);
    }

    @Override
    public Page<Attendance> findByCompanyCode(String companyCode, Pageable pageable) {

        String jpql = "SELECT a FROM Attendance a WHERE a.user.company.companyCode = :companyCode ORDER BY a.attendTime DESC";

        // 페이징 처리를 해야 하는 쿼리라면 직접 TypedQuery로 JPQL을 작성할 때 반드시 페이징 조건을 넣어줘야 한다.
        TypedQuery<Attendance> query = em.createQuery(jpql, Attendance.class);
        query.setParameter("companyCode", companyCode);
        // query.setFirstResult(offset) → 조회 시작 위치 (몇 번째 데이터부터 가져올지)
        query.setFirstResult((int) pageable.getOffset());
        // query.setMaxResults(limit) → 한 번에 가져올 최대 데이터 개수 (페이지 크기)
        query.setMaxResults(pageable.getPageSize());

        List<Attendance> results = query.getResultList();

        String countJpql = "SELECT COUNT(a) FROM Attendance a WHERE a.user.company.companyCode = :companyCode";
        TypedQuery<Long> countQuery = em.createQuery(countJpql, Long.class);
        countQuery.setParameter("companyCode", companyCode);
        Long total = countQuery.getSingleResult();

        //페이징이 필요 없으면 그냥 getResultList()만 써서 전체 리스트를 가져오면 됨
        //페이징이 필요한데 setFirstResult나 setMaxResults를 안 쓰면 DB에서 모든 데이터를 다 가져오므로 느리고 비효율적임.
        return new PageImpl<>(results, pageable, total);
    }

    @Override
    public Page<Attendance> findByFilter(String companyCode, String userName, String deptName, LocalDate date, Pageable pageable) {

        /*
        개발 편의성이나 짧은 코드라면 String으로도 충분히 작성 가능
        반복적으로 많이 붙이고, 조건이 많아질 경우엔 StringBuilder 권장
        성능 차이는 아주 작은 프로젝트나 간단 쿼리에선 크게 느껴지지 않지만,
        대규모 데이터 처리나 빈번한 호출에는 StringBuilder가 훨씬 효율적이라고 함
        */

        // 1. JPQL 시작
        StringBuilder jpql = new StringBuilder("SELECT a FROM Attendance a JOIN a.user u WHERE u.company.companyCode = :companyCode ");
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(a) FROM Attendance a JOIN a.user u WHERE u.company.companyCode = :companyCode ");

        // 2. 조건이 있을 때마다 쿼리문에 추가
        Map<String, Object> params = new HashMap<>();
        params.put("companyCode", companyCode);

        if (userName != null) {
            userName = userName.trim();
        }

        if (userName != null && !userName.isEmpty()) {
            jpql.append(" AND u.userName LIKE :userName ");
            countJpql.append(" AND u.userName LIKE :userName ");
            params.put("userName", "%" + userName + "%");
        }
        if (deptName != null && !deptName.isEmpty()) {
            jpql.append(" AND u.department.deptName = :deptName ");
            countJpql.append(" AND u.department.deptName = :deptName ");
            params.put("deptName", deptName);
        }
        if (date != null) {
            // 수정된 부분: LocalDateTime 범위를 사용하여 날짜 필터링
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
            jpql.append(" AND a.attendTime BETWEEN :startOfDay AND :endOfDay ");
            countJpql.append(" AND a.attendTime BETWEEN :startOfDay AND :endOfDay ");
            params.put("startOfDay", startOfDay);
            params.put("endOfDay", endOfDay);
        }

        // 3. 정렬조건 넣기 (pageable에 있는 정렬조건 활용)
        if (pageable.getSort().isSorted()) {
            jpql.append(" ORDER BY ");
            String orderBy = pageable.getSort().stream()
                    .map(order -> "a." + order.getProperty() + " " + order.getDirection().name())
                    .collect(Collectors.joining(", "));
            jpql.append(orderBy);
        } else {
            jpql.append(" ORDER BY a.attendTime DESC "); // 기본 정렬
        }

        // 4. 쿼리 생성 및 파라미터 바인딩
        TypedQuery<Attendance> query = em.createQuery(jpql.toString(), Attendance.class);
        TypedQuery<Long> countQuery = em.createQuery(countJpql.toString(), Long.class);

        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
            countQuery.setParameter(entry.getKey(), entry.getValue());
        }

        // 5. 페이징 적용
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        // 6. 결과 조회
        List<Attendance> results = query.getResultList();
        Long total = countQuery.getSingleResult();

        System.out.println("userName 파라미터: " + userName);
        System.out.println("JPQL 쿼리: " + jpql.toString());
        System.out.println("파라미터 맵: " + params);


        // 7. Page 객체 리턴
        return new PageImpl<>(results, pageable, total);
    }

    @Override
    public List<AttendanceDto.WeeklyAttendanceDto> findWeeklyAttendanceSummary(String companyCode) {
        // 1. 이번 주 날짜 구하기 (오늘부터 6일 전까지)
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        LocalDate weekEnd = today;

        // 날짜별 요일 이름 배열 (일~토)
        String[] dayNames = {"일", "월", "화", "수", "목", "금", "토"};

        // 2. 결과 저장용 Map: 날짜 문자열 -> DTO
        Map<String, AttendanceDto.WeeklyAttendanceDto> summaryMap = new LinkedHashMap<>();

        // 초기화: 7일 치 기본값 세팅
        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            String dayOfWeekName = dayNames[date.getDayOfWeek().getValue() % 7]; // 일요일=7이므로 %7 처리
            summaryMap.put(date.toString(),
                    AttendanceDto.WeeklyAttendanceDto.builder()
                            .day(dayOfWeekName)
                            .normal(0)
                            .late(0)
                            .absent(0)
                            .vacation(0)
                            .build()
            );
        }

        // 3. 출퇴근 상태별 집계 쿼리
        String attendanceJpql =
                "SELECT FUNCTION('DATE', a.attendTime), a.status, COUNT(a) " +
                        "FROM Attendance a " +
                        "WHERE a.user.company.companyCode = :companyCode " +
                        "AND a.attendTime BETWEEN :start AND :end " +
                        "GROUP BY FUNCTION('DATE', a.attendTime), a.status";

        List<Object[]> attendanceStats = em.createQuery(attendanceJpql, Object[].class)
                .setParameter("companyCode", companyCode)
                .setParameter("start", weekStart.atStartOfDay())
                .setParameter("end", weekEnd.atTime(LocalTime.MAX))
                .getResultList();

        for (Object[] row : attendanceStats) {
            Date sqlDate = (Date) row[0];               // java.sql.Date
            LocalDate date = sqlDate.toLocalDate();     // LocalDate 변환

            AttendanceStatus status = (AttendanceStatus) row[1];  // enum 타입으로 캐스팅
            Long count = (Long) row[2];

            AttendanceDto.WeeklyAttendanceDto dto = summaryMap.get(date.toString());
            if (dto == null) continue;

            switch (status) {
                case L:  // 정상 출근
                    dto.setNormal(dto.getNormal() + count.intValue());
                    break;
                case W:  // 결근(휴가 아님)
                    dto.setAbsent(dto.getAbsent() + count.intValue());
                    break;
                default:
                    break;
            }
        }

        // 4. 휴가 통계 JPQL (Vacation 엔티티에 맞게 수정 필요)
        List<VacationAdmin> vacations = em.createQuery(
                        "SELECT v FROM VacationAdmin v WHERE v.user.company.companyCode = :companyCode AND v.endDate >= :start AND v.startDate <= :end AND v.status = 'Y'",
                        VacationAdmin.class)
                .setParameter("companyCode", companyCode)
                .setParameter("start", weekStart)
                .setParameter("end", weekEnd)
                .getResultList();

        for (VacationAdmin v : vacations) {
            LocalDate vacStart = v.getStartDate().isBefore(weekStart) ? weekStart : v.getStartDate();
            LocalDate vacEnd = v.getEndDate().isAfter(weekEnd) ? weekEnd : v.getEndDate();

            for (LocalDate date = vacStart; !date.isAfter(vacEnd); date = date.plusDays(1)) {
                AttendanceDto.WeeklyAttendanceDto dto = summaryMap.get(date.toString());
                if (dto != null) {
                    dto.setVacation(dto.getVacation() + 1);
                }
            }
        }

        // 5. Map 값을 List로 변환하여 반환
        return new ArrayList<>(summaryMap.values());
    }



}