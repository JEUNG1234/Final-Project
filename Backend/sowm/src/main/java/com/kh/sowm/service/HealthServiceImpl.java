package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto.Response;
import com.kh.sowm.dto.MedicalCheckDto.MedicalCheckResultDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionRequestDto.QuestionScore;
import com.kh.sowm.dto.MedicalCheckDto.MentalResultDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalResultDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalResultDto.QuestionScoreDto;
import com.kh.sowm.entity.MedicalCheckHeadScore;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.MedicalCheckHeadScoreRepository;
import com.kh.sowm.repository.MedicalCheckRepository;
import com.kh.sowm.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthServiceImpl implements HealthService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final MedicalCheckRepository medicalCheckRepository;
    private final MedicalCheckHeadScoreRepository medicalCheckHeadScoreRepository;

    // 인텔리제이 환경변수에 저장해놓은 api 키
    @Value("${openai.api-key}")
    private String apiKey;

    // OpenAI에서 ChatGPT 기능을 사용하려면 위 API URL로 POST 요청을 보내야 함
    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    // AI 호출 메서드(가장 중요)
    private String callMentalOpenAI(List<QuestionScore> questionScores) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        StringBuilder contentBuilder = new StringBuilder();
        for (int i = 0; i < questionScores.size(); i++) {
            MentalQuestionRequestDto.QuestionScore qs = questionScores.get(i);
            contentBuilder.append(i + 1)
                    .append(". ")
                    .append(qs.getQuestion())
                    .append(" : ")
                    .append(qs.getScore())
                    .append("점\n");
        }
        String content = contentBuilder.toString();

        int totalScore = questionScores.stream().mapToInt(QuestionScore::getScore).sum();

        String prompt = "아래 점수들을 바탕으로 심리검사 결과를 작성해 주세요.\n" +
                "- 각 점수는 1점에서 10점 사이이며, 점수가 낮을수록 심리 증상이 심한 것을 의미합니다.\n" +
                "- 총점이 높을수록 우울증이나 불안장애 가능성이 낮음을 뜻합니다.\n" +
                "- 총점에 따라 다음 기준으로 상태를 판단하세요:\n" +
                "    - 총점 90점 이상: 매우 건강한 상태\n" +
                "    - 총점 70점 이상 89점 이하: 양호한 상태\n" +
                "    - 총점 50점 이상 69점 이하: 주의가 필요한 상태\n" +
                "    - 총점 50점 미만: 전문가 상담이 필요함\n\n" +
                "총점: " + totalScore + "점\n\n" +
                "아래 점수 내용을 참고하세요:\n" +
                content + "\n" +
                "출력 형식:\n" +
                "심리 검사 결과: [해당 상태]\n" +
                "총 점수: " + totalScore + "점\n" +
                "추천 가이드:\n" +
                "- 1. (간결하고 실용적인 가이드 1)\n" +
                "- 2. (간결하고 실용적인 가이드 2)\n" +
                "- 3. (간결하고 실용적인 가이드 3)\n\n" +
                "※ 반드시 총점과 상태가 일치하도록 작성해 주세요.";
        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", prompt)
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", messages,
                "max_tokens", 300,
                "temperature", 0.0,
                "top_p", 1.0,
                "n", 1
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<?, ?> body = response.getBody();
            List<Map<?, ?>> choices = (List<Map<?, ?>>) body.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<?, ?> message = (Map<?, ?>) choices.get(0).get("message");
                if (message != null) {
                    Object contentObj = message.get("content");
                    if (contentObj != null) {
                        return contentObj.toString().trim();
                    }
                }
            }
        }
        return "AI 가이드 메시지 생성에 실패했습니다.";
    }

    private String callPhysicalOpenAI(List<PhysicalQuestionRequestDto.QuestionScore> questionScores) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        StringBuilder contentBuilder = new StringBuilder();
        for (int i = 0; i < questionScores.size(); i++) {
            PhysicalQuestionRequestDto.QuestionScore qs = questionScores.get(i);
            contentBuilder.append(i + 1)
                    .append(". ")
                    .append(qs.getQuestion())
                    .append(" : ")
                    .append(qs.getScore())
                    .append("점\n");
        }
        String content = contentBuilder.toString();

        int totalScore = questionScores.stream().mapToInt(PhysicalQuestionRequestDto.QuestionScore::getScore).sum();

        String prompt = "아래 점수들을 바탕으로 신체검사 결과를 작성해 주세요.\n"
                +"_ 각 점수는 1점에서 10점 사이이며, 점수가 낮들수록 건강 상태가 나쁨를 의미합니다.\n"
                +"_ 총점이 높을수록 전반적인 신체 건강 상태가 양호함을 뜻합니다.\n"
                +"_총점 기준:\n"
                +"- 총점 90점 이상: 매우 건강한 상태\n"
                +"- 총점 70점 이상·89점 이하: 양호한 상태\n"
                +"- 총점 50점 이상 69점 이하: 주의가 필요한 상태\n"
                +"- 총점 50점 미만: 전문가 진료가 필요함\n\n"
                +"총점: " + totalScore +"점\n\n"
                +"아래 점수 내용를 참고하세요:\n" +
                content + "\n"
                +"출력 형식:\n"
                +"신체검사 결과: [해당 상태]\n"
                +"총 점수: " + totalScore +"점\n"
                +"추천 가이드:\n"
                +"- 1. (생활 습관 개선 조언)\n"
                +"- 2. (운동, 영양, 수면 등)\n"
                +"- 3. 필요 시 병원 방문 안내)\n\n"
                + "※ 반드시 총점과 상태가 일치하도록 작성해 주세요.";
        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", prompt)
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", messages,
                "max_tokens", 300,
                "temperature", 0.0,
                "top_p", 1.0,
                "n", 1
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<?, ?> body = response.getBody();
            List<Map<?, ?>> choices = (List<Map<?, ?>>) body.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<?, ?> message = (Map<?, ?>) choices.get(0).get("message");
                if (message != null) {
                    Object contentObj = message.get("content");
                    if (contentObj != null) {
                        return contentObj.toString().trim();
                    }
                }
            }
        }
        return "AI 가이드 메시지 생성에 실패했습니다.";
    }





    @Override
    public MentalQuestionDto getMentalQuestion(MentalQuestionRequestDto requestDto, String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        // ai 가이드 메세지
        String guideMessage = callMentalOpenAI(requestDto.getQuestionScores());
        System.out.println("openai 로 받아온 가이드 메시지 : " + guideMessage);
        
        // 총점
        int totalScore = requestDto.getQuestionScores().stream()
                .mapToInt(MentalQuestionRequestDto.QuestionScore::getScore)
                .sum();

        // 검사 결과 엔티티 생성 및 저장
        MedicalCheckResult medicalCheckResult = MedicalCheckResult.builder()
                .user(user)
                .medicalCheckTotalScore(totalScore)
                .medicalCheckType(MedicalCheckResult.Type.PSYCHOLOGY) // 심리검사 타입
                .guideMessage(guideMessage)
                .build();
        medicalCheckRepository.save(medicalCheckResult);

        // 개별 문항 점수 저장 추가
        for (MentalQuestionRequestDto.QuestionScore questionScore : requestDto.getQuestionScores()) {
            MedicalCheckHeadScore headScore = MedicalCheckHeadScore.builder()
                    .medicalCheckResult(medicalCheckResult)
                    .headScore(questionScore.getScore())
                    .questionText(questionScore.getQuestion())
                    .build();

            medicalCheckHeadScoreRepository.save(headScore);
        }

        // DTO 반환
        MentalQuestionDto resultDto = new MentalQuestionDto();
        resultDto.setTotalScore(totalScore);
        resultDto.setGuideMessage(guideMessage);

        return resultDto;
    }

    @Override
    public MentalResultDto getMentalCheckResult(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        MedicalCheckResult result = medicalCheckRepository.findResultByUserId(user, Type.PSYCHOLOGY)
                .orElseThrow(()-> new IllegalArgumentException("심리검사가 존재하지 않습니다."));

        List<MentalResultDto.QuestionScoreDto> questionScores = medicalCheckRepository
                .findByMedicalCheckResult(result).stream()
                .map(score -> MentalResultDto.QuestionScoreDto.builder()
                        .questionNo(score.getHeadNo())          // headNo로 변경
                        .questionText(score.getQuestionText())  // 질문 텍스트가 엔티티에 없으면 따로 처리 필요
                        .score(score.getHeadScore())            // headScore로 변경
                        .build())
                .collect(Collectors.toList());

        return MentalResultDto.builder()
                .totalScore(result.getMedicalCheckTotalScore())
                .guideMessage(result.getGuideMessage())
                .questionScores(questionScores)
                .medicalCheckCreateDate(result.getMedicalCheckCreateDate())
                .build();
    }

    @Override
    public PhysicalQuestionDto getPhysicalQuestion(PhysicalQuestionRequestDto requestDto, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        // ai 가이드 메세지
        String guideMessage = callPhysicalOpenAI(requestDto.getQuestionScores());
        System.out.println("openai 로 받아온 가이드 메시지 : " + guideMessage);

        // 총점
        int totalScore = requestDto.getQuestionScores().stream()
                .mapToInt(PhysicalQuestionRequestDto.QuestionScore::getScore)
                .sum();

        // 검사 결과 엔티티 생성 및 저장
        MedicalCheckResult medicalCheckResult = MedicalCheckResult.builder()
                .user(user)
                .medicalCheckTotalScore(totalScore)
                .medicalCheckType(MedicalCheckResult.Type.PHYSICAL) // 신체검사 타입
                .guideMessage(guideMessage)
                .build();
        medicalCheckRepository.save(medicalCheckResult);

        // 개별 문항 점수 저장 추가
        for (PhysicalQuestionRequestDto.QuestionScore questionScore : requestDto.getQuestionScores()) {
            MedicalCheckHeadScore headScore = MedicalCheckHeadScore.builder()
                    .medicalCheckResult(medicalCheckResult)
                    .headScore(questionScore.getScore())
                    .questionText(questionScore.getQuestion())
                    .build();

            medicalCheckHeadScoreRepository.save(headScore);
        }

        // DTO 반환
        PhysicalQuestionDto resultDto = new PhysicalQuestionDto();
        resultDto.setTotalScore(totalScore);
        resultDto.setGuideMessage(guideMessage);

        return resultDto;
    }

    @Override
    public PhysicalResultDto getPhysicalCheckResult(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        MedicalCheckResult result = medicalCheckRepository.findResultByUserId(user, Type.PHYSICAL)
                .orElseThrow(()-> new IllegalArgumentException("신체검사가 존재하지 않습니다."));

        List<PhysicalResultDto.QuestionScoreDto> questionScores = medicalCheckRepository
                .findByMedicalCheckResult(result).stream()
                .map(score -> PhysicalResultDto.QuestionScoreDto.builder()
                        .questionNo(score.getHeadNo())          // headNo로 변경
                        .questionText(score.getQuestionText())  // 질문 텍스트가 엔티티에 없으면 따로 처리 필요
                        .score(score.getHeadScore())            // headScore로 변경
                        .build())
                .collect(Collectors.toList());

        return PhysicalResultDto.builder()
                .totalScore(result.getMedicalCheckTotalScore())
                .guideMessage(result.getGuideMessage())
                .questionScores(questionScores)
                .medicalCheckCreateDate(result.getMedicalCheckCreateDate())
                .build();
    }

    @Override
    public Page<MedicalCheckResultDto> getResultList(Pageable pageable, LocalDate createDate, Type type) {
        Page<MedicalCheckResult> results = medicalCheckRepository.findResults(pageable, createDate, type);

        return results.map(r -> MedicalCheckResultDto.builder()
                .medicalCheckResultNo(r.getMedicalCheckResultNo())
                .medicalCheckCreateDate(r.getMedicalCheckCreateDate().toString())
                .medicalCheckType(convertType(r.getMedicalCheckType()))
                .medicalCheckTotalScore(r.getMedicalCheckTotalScore())
                .guideMessage(r.getGuideMessage())
                .build());
    }

    private String convertType(MedicalCheckResult.Type type) {
        return switch (type) {
            case PHYSICAL -> "신체검사";
            case PSYCHOLOGY -> "심리검사";
        };
    }

}
