package com.kh.sowm.service;

import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.entity.VoteContent;
import com.kh.sowm.repository.VoteContentRepository;
import com.kh.sowm.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional // 클래스 내의 모든 메소드는 하나의 트랜잭션으로 묶입니다.
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final VoteContentRepository voteContentRepository;

    /**
     * 새로운 투표와 그에 따른 선택 항목들을 데이터베이스에 저장합니다.
     */
    @Override
    public Long createVote(VoteDto.CreateRequest createRequest) {
        // 1. Vote 엔티티 생성 및 저장
        Vote newVote = Vote.builder()
                .voteWriter(createRequest.getVoteWriter())
                .voteTitle(createRequest.getVoteTitle())
                .voteType(createRequest.getVoteType())
                .voteCreatedDate(LocalDate.now())
                .voteEndDate(createRequest.getVoteEndDate())
                .status("진행중") // 기본 상태는 '진행중'
                .totalVotes(0)   // 초기 투표수는 0
                .build();
        Vote savedVote = voteRepository.save(newVote);

        // 2. VoteContent 엔티티 리스트 생성 및 저장
        List<VoteContent> voteContents = new ArrayList<>();
        for (String optionText : createRequest.getOptions()) {
            VoteContent voteContent = VoteContent.builder()
                    .voteNo(savedVote.getVoteNo()) // 방금 저장된 Vote의 ID를 참조
                    .voteContent(optionText)
                    .voteCount(0) // 초기 득표수는 0
                    .build();
            voteContents.add(voteContent);
        }
        voteContentRepository.saveAll(voteContents); // 여러 항목을 한 번에 저장

        return savedVote.getVoteNo();
    }

    /**
     * 모든 투표 목록을 조회하여 DTO 리스트로 변환하여 반환합니다.
     */
    @Override
    @Transactional(readOnly = true) // 데이터 변경이 없는 조회 작업이므로 readOnly=true로 성능 최적화
    public List<VoteDto.VoteListResponse> getAllVotes() {
        return voteRepository.findAll().stream() // 모든 Vote를 조회
                .map(VoteDto.VoteListResponse::toDto) // DTO로 변환
                .collect(Collectors.toList()); // 리스트로 수집
    }

    /**
     * 특정 투표와 그에 속한 항목들의 상세 정보를 조회하여 DTO로 반환합니다.
     */
    @Override
    @Transactional(readOnly = true)
    public VoteDto.VoteDetailResponse getVoteDetails(Long voteNo) {
        // 투표 ID로 Vote 엔티티를 찾습니다. 없으면 예외를 발생시킵니다.
        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 투표를 찾을 수 없습니다. id=" + voteNo));

        // 투표 ID에 해당하는 모든 투표 항목들을 찾습니다.
        List<VoteContent> voteContents = voteContentRepository.findByVoteNo(voteNo);

        // 조회된 엔티티들을 상세 DTO로 변환하여 반환합니다.
        return VoteDto.VoteDetailResponse.toDto(vote, voteContents);
    }
}