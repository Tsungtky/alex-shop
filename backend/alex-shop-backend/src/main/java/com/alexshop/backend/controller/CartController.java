package com.alexshop.backend.controller;

import com.alexshop.backend.entity.CartItem;
import com.alexshop.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public List<CartItem> getCartByUserId(@PathVariable Integer userId){
        return cartService.getCartByUserId(userId);
    }

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem cartItem){
        return cartService.addToCart(cartItem);
    }

    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Integer id){
        cartService.removeFromCart(id);
    }

    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable Integer id, @RequestParam Integer quantity){
        return cartService.updateQuantity(id, quantity);
    }
}
