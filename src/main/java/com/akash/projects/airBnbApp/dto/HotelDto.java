package com.akash.projects.airBnbApp.dto;

import com.akash.projects.airBnbApp.entity.HotelContactInfo;
import jakarta.persistence.*;
import lombok.Data;

@Data

public class HotelDto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private String city;
    private String[] photos;
    private String[] amenities;
    private HotelContactInfo contactInfo;
    private boolean isActive;
}
