package com.alexshop.backend.repository;

import com.alexshop.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserId(Integer userId);
    CartItem findByUserIdAndProductId(Integer userId, Integer productId);
}
