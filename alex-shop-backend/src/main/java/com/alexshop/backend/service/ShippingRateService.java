package com.alexshop.backend.service;

import com.alexshop.backend.entity.CartItem;
import com.alexshop.backend.entity.ShippingRate;
import com.alexshop.backend.repository.ShippingRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShippingRateService {
    private final ShippingRateRepository shippingRateRepository;
    private final CartService cartService;


    public List<ShippingRate> getAllShippingRate(){
        return shippingRateRepository.findAll();
    }

    public ShippingRate addNewShippingRate(ShippingRate shippingRate){
        return shippingRateRepository.save(shippingRate);
    }

    public ShippingRate updateShippingRate(ShippingRate shippingRate){
        return shippingRateRepository.save(shippingRate);
    }

    public void deleteShippingRateById(Integer id){
        shippingRateRepository.deleteById(id);
    }

    public Integer calculateTotalWeight(Integer userId){
        Integer totalWeight = 0;
        List<CartItem> cartItemList = cartService.getCartByUserId(userId);
        for (CartItem item : cartItemList){
            totalWeight += item.getProduct().getWeight() * item.getQuantity();
        }
        return totalWeight;
    }

    public Integer calculateShippingFee(String country, Integer weight){
        ShippingRate rate = shippingRateRepository.findByCountry(country);
        if(rate == null){
            throw new RuntimeException("No shipping rate for"+country);
        }
        return rate.getBaseFee() + (weight / 1000 * rate.getPerKgFee());
    }
}
