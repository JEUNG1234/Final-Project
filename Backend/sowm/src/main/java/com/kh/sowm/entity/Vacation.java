package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VACATION")
public class Vacation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VACATION_NO")
    private Long vacationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "REASON", nullable = false, length = 100)
    private String reason;

    @Column(name = "GRANTED_DATE", nullable = false)
    private LocalDate grantedDate;

    @PrePersist
    public void prePersist() {
        if (this.grantedDate == null) {
            this.grantedDate = LocalDate.now();
        }
    }
}