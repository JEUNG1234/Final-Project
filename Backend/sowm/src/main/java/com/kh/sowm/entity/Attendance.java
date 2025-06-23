package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "ATTENDANCE")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTENDANCE_NO")
    private Long attendanceNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "ATTEND_TIME")
    private LocalDateTime attendTime;

    @ManyToOne
    @JoinColumn(name = "COMPANY_CODE", insertable = false, updatable = false)
    private Company company;

    @Column(name = "LEAVE_TIME")
    private LocalDateTime leaveTime;

    //상태값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.AttendanceStatus status;

    @Column(name = "WORK_HOURS")
    private Double workHours;

    @PrePersist
    public void prePersist(){
        if(attendTime == null){
            attendTime = LocalDateTime.now();
        }
        if(this.status == null) {
            this.status = CommonEnums.AttendanceStatus.W;
        }
    }

    public void markClockOut() {
        this.leaveTime = LocalDateTime.now();
        this.status = CommonEnums.AttendanceStatus.L;
    }

    public void setWorkHours(Double workHours) {
        this.workHours = workHours;
    }

    public void updateAttendance(LocalDateTime attendTime, LocalDateTime leaveTime) {
        this.attendTime = attendTime;
        this.leaveTime = leaveTime;
        this.status = (attendTime != null && leaveTime != null) ? CommonEnums.AttendanceStatus.L : CommonEnums.AttendanceStatus.W;
    }
}