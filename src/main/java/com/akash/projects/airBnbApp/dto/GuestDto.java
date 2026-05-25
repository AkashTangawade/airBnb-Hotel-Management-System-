package com.akash.projects.airBnbApp.dto;

import com.akash.projects.airBnbApp.entity.enums.Gender;
import lombok.Data;

@Data
public class GuestDto {

    private Long id;
    private String name;
    private Gender gender;
    private Integer age;
}
