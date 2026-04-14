package com.alexshop.backend.controller;

import com.alexshop.backend.entity.ShippingRate;
import com.alexshop.backend.service.ShippingRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shippingRate")
@RequiredArgsConstructor
public class ShippingRateController {
    private final ShippingRateService shippingRateService;

    //Admin can check all list
    @GetMapping
    public List<ShippingRate> getAllShippingRate(){
        return  shippingRateService.getAllShippingRate();
    }

    //Admin can add new shipping rate
    @PostMapping
    public ShippingRate addNewShippingRate(@RequestBody ShippingRate shippingRate){
        return shippingRateService.addNewShippingRate(shippingRate);
    }

    //Admin can update shipping rate
    @PutMapping
    public ShippingRate updateShippingRate(@RequestBody ShippingRate shippingRate){
        return shippingRateService.updateShippingRate(shippingRate);
    }

    //Admin can delete shipping rate
    @DeleteMapping("/{id}")
    public void deleteShippingRateById(@PathVariable Integer id){
        shippingRateService.deleteShippingRateById(id);
    }

    //User select country to see shipping fee
    @GetMapping("/calculate")
    public Integer getShippingFee(@RequestParam Integer userId, @RequestParam String country){
       Integer totalWeight = shippingRateService.calculateTotalWeight(userId);
       return shippingRateService.calculateShippingFee(country, totalWeight);
    }
}
