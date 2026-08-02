package com.akash.projects.airBnbApp.dto;

import com.akash.projects.airBnbApp.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestDto {
    private Long id;
    private String name;
    private Integer age;
    private Gender gender;
}
