package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Order;
import com.alexshop.backend.entity.Product;
import com.alexshop.backend.entity.User;
import com.alexshop.backend.service.OrderService;
import com.alexshop.backend.service.ShippingRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final ShippingRateService shippingRateService;

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

    @GetMapping("/shipping-fee")
    public Integer getShippingFee(@RequestParam String country, @RequestParam Integer userId) {
        Integer totalWeight = shippingRateService.calculateTotalWeight(userId);
        return shippingRateService.calculateShippingFee(country, totalWeight);
    }

    @GetMapping("/check-stock")
    public void checkStock(@RequestParam Integer userId) {
        orderService.checkStock(userId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order){
        User user = order.getUser();
        Integer userId = user.getId();
        String couponCode = order.getCouponCode();
        String shippingCountry = order.getShippingCountry();
        String shippingFirstName = order.getShippingFirstName();
        String shippingLastName = order.getShippingLastName();
        String shippingPhoneCountryCode = order.getShippingPhoneCountryCode();
        String shippingPhone = order.getShippingPhone();
        String shippingAddress = order.getShippingAddress();
        String shippingApartment = order.getShippingApartment();
        String shippingCity = order.getShippingCity();
        String shippingState = order.getShippingState();
        String shippingPostalCode = order.getShippingPostalCode();
        return orderService.createOrder(userId, couponCode, shippingCountry, shippingFirstName, shippingLastName, shippingPhoneCountryCode, shippingPhone, shippingAddress, shippingApartment, shippingCity, shippingState, shippingPostalCode);
    }
    //Admin can update order status
    @PutMapping("/{id}")
    public Order updateOrderStatus(@PathVariable Integer id,@RequestParam String status){
        return orderService.updateOrderStatus(id, status);
    }

    //Admin can update tracking number
    @PutMapping("/{id}/tracking")
    public Order updateTrackingNumber(@PathVariable Integer id, @RequestParam String trackingNumber) {
        return orderService.updateTrackingNumber(id, trackingNumber);
    }

    //User requests cancellation
    @PutMapping("/{id}/request-cancel")
    public Order requestCancellation(@PathVariable Integer id) {
        return orderService.requestCancellation(id);
    }

    //Admin/User can cancel order(not delete)
    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Integer id){
        return orderService.cancelOrder(id);
    }
}
