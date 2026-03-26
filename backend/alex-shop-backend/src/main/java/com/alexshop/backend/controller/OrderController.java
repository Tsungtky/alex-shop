package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Order;
import com.alexshop.backend.entity.Product;
import com.alexshop.backend.entity.User;
import com.alexshop.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    //Admin can see all orders
    @GetMapping
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    //User can get all orders
    @GetMapping("/user/{userId}")
    public List<Order> getOrderByUserId(@PathVariable Integer userId){
        return orderService.getOrdersByUserId(userId);
    }

    //User/Admin can see one order
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Integer id){
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order){
        User user = order.getUser();
        Integer userId = user.getId();
        String couponCode = order.getCouponCode();
        String shippingCountry = order.getShippingCountry();
        return orderService.createOrder(userId, couponCode, shippingCountry);
    }
    //Admin can update order status
    @PutMapping("/{id}")
    public Order updateOrderStatus(@PathVariable Integer id,@RequestParam String status){
        return orderService.updateOrderStatus(id, status);
    }

    //Admin/User can cancel order(not delete)
    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Integer id){
        return orderService.cancelOrder(id);
    }
}
