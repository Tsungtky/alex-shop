package com.alexshop.backend.service;

import com.alexshop.backend.entity.CartItem;
import com.alexshop.backend.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartItemRepository cartItemRepository;

    // Cart service contains features:
    // 1)show user's cart (getCartByUserId)
    // 2)add item to cart (addToCart)
    // 3)remove item from cart (removeFromCart)
    // 4)update quantity (updateQuantity)

    public List<CartItem> getCartByUserId(Integer userId){
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(CartItem cartItem){
        CartItem existing = cartItemRepository.findByUserIdAndProductId(
                cartItem.getUser().getId(), cartItem.getProduct().getId());

        int newQuantity = cartItem.getQuantity();
        if (existing != null) {
            newQuantity += existing.getQuantity();
        }

        if (existing != null) {
            existing.setQuantity(newQuantity);
            return cartItemRepository.save(existing);
        }
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Integer cartItemId){
        cartItemRepository.deleteById(cartItemId);
    }

    public CartItem updateQuantity(Integer cartItemId, Integer quantity){
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow();
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }
}
