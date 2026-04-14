package com.alexshop.backend.repository;

import com.alexshop.backend.entity.ShippingRate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingRateRepository extends JpaRepository<ShippingRate, Integer> {
    ShippingRate findByCountry(String country);
}
