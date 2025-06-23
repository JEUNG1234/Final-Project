package com.kh.sowm.repository;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
// 조건으로 직원 출퇴근 정보 확인 , 개발중
//    @Override
//    public List<Attendance> findByFilters(String userName, String deptName, LocalDate date) {
//        return List.of();
//    }


}
