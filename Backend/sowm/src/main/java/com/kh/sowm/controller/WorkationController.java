package com.kh.sowm.controller;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.service.WorkationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkationController {

    private final WorkationService workationService;

    //워케이션 생성
    @PostMapping("/create")
    public ResponseEntity<WorkationDto.ResponseDto> create(@RequestBody WorkationDto.WorkationCreateDto request) {
        WorkationDto.ResponseDto savedWorkation = workationService.enrollWorkation(request);

        return new ResponseEntity<>(savedWorkation, HttpStatus.CREATED);
    }

    //워케이션 리스트 조회
    @GetMapping("/list")
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> list(@RequestParam String companyCode) {

        return workationService.workationList(companyCode);
    }

    //워케이션 정보 조회
    @GetMapping("/info")
    public WorkationDto.ResponseDto info(@RequestParam int locationNo) {

        return workationService.workationInfo(locationNo);
    }

    //워케이션 신청
    @PostMapping("/submit")
    public WorkationDto.SubWorkation submit(@RequestBody WorkationDto.SubWorkation subWork) {

        return workationService.submit(subWork);
    }

    @PatchMapping("/update")
    public ResponseEntity<WorkationDto.ResponseUpdateDto> update(@RequestBody WorkationDto.WorkationUpdateDto request) {
        WorkationDto.ResponseDto updatedWorkationDto  = workationService.updateWorkation(request);


        // workationService.updateWorkation()은 WorkationDto.ResponseDto를 반환하므로,
        // 이를 WorkationDto.ResponseUpdateDto로 변환해야 합니다.


        // ResponseDto에서 ResponseUpdateDto로 변환하는 정적 메서드를 WorkationDto.ResponseUpdateDto 내에 추가하면 편리합니다.
        // 현재 ResponseUpdateDto.toDto는 Workation 엔티티를 받으므로, WorkationDto.ResponseDto를 받는 메서드를 추가하거나
        // Service에서 Workation 엔티티를 반환하도록 변경하는 것을 고려할 수 있습니다.
        // 일단은 WorkationDto.ResponseDto의 필드를 직접 복사하여 WorkationDto.ResponseUpdateDto를 생성하겠습니다.
        WorkationDto.ResponseUpdateDto responseUpdateDto = WorkationDto.ResponseUpdateDto.builder()
                .workationTitle(updatedWorkationDto.getWorkationTitle())
                .placeImage(updatedWorkationDto.getPlaceImage())
                .address(updatedWorkationDto.getAddress())
                .placeInfo(updatedWorkationDto.getPlaceInfo())
                .feature(updatedWorkationDto.getFeature())
                .workationStartDate(updatedWorkationDto.getWorkationStartDate())
                .workationEndDate(updatedWorkationDto.getWorkationEndDate())
                .facilityImage(updatedWorkationDto.getFacilityImage())
                .facilityInfo(updatedWorkationDto.getFacilityInfo())
                .openHours(updatedWorkationDto.getOpenHours())
                .spaceType(updatedWorkationDto.getSpaceType())
                .area(updatedWorkationDto.getArea())
                .peopleMin(updatedWorkationDto.getPeopleMin())
                .peopleMax(updatedWorkationDto.getPeopleMax())
                .url(updatedWorkationDto.getUrl())
                .precautions(updatedWorkationDto.getPrecautions())
                .busInfo(updatedWorkationDto.getBusInfo())
                .parkingInfo(updatedWorkationDto.getParkingInfo())
                .latitude(updatedWorkationDto.getLatitude())
                .longitude(updatedWorkationDto.getLongitude())
                .userId(updatedWorkationDto.getUserId())
                // locationNo와 workationNo는 ResponseDto에 없으므로, 원래 DTO에서 가져와야 합니다.
                // 이 부분을 위해 service의 updateWorkation이 Workation 엔티티를 반환하고,
                // 컨트롤러에서 그 엔티티로 ResponseUpdateDto를 만드는 것이 더 깔끔할 수 있습니다.
                // 또는 ResponseDto에 이 필드들을 추가하는 것도 방법입니다.
                // 일단은 ResponseUpdateDto의 toDto 메서드를 활용하기 위해 Service 메서드 반환 타입을 변경하는 것을 권장합니다.
                .build();
        return new ResponseEntity<>(responseUpdateDto, HttpStatus.OK);
    }
}
