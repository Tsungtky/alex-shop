package com.alexshop.backend.service;

import com.alexshop.backend.entity.*;
import com.alexshop.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    // Due to "create order"
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponService couponService;
    private final ShippingRateService shippingRateService;
    private final UserRepository userRepository;

    // Admin can see all orders
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    //User can check their orders
    public List<Order> getOrdersByUserId(Integer userId){
        return orderRepository.findAllByUserId(userId);
    }

    //Get one order by ID
    public Order getOrderById(Integer orderId){
        return orderRepository.findById(orderId).orElseThrow();
    }

    // Update status manually by Admin, the reason using ID and status is to
    // not let customer change other data (including amount...etc)
    public Order updateOrderStatus(Integer orderId, String status){
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // Cancel order
    public Order cancelOrder(Integer orderId){
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus("cancelled");
        return orderRepository.save(order);
    }

    //Create order. Need inject Repositories and Services
    //including CartItem, OrderItem, Coupon, ShippingFee
    //Need to know who is placing order, coupon used, delivery country
    public Order createOrder(Integer userId, String couponCode, String shippingCountry, String shippingAddress){
        List<CartItem> cartItemList = cartItemRepository.findByUserId(userId);
        Integer totalAmount = 0;
        Integer totalWeight = shippingRateService.calculateTotalWeight(userId);
        for (CartItem item : cartItemList){
            totalAmount += item.getProduct().getPrice() * item.getQuantity();
        }
        Integer shippingFee = shippingRateService.calculateShippingFee(shippingCountry, totalWeight);
        Integer discountAmount = 0;
        if(couponCode!=null && !couponCode.isEmpty()){
            Coupon coupon = couponService.getCouponByCode(couponCode);
            if(coupon.getType().equals("shipping")){
                shippingFee = 0;
            } else {
                Integer discountedAmount = couponService.applyCoupon(totalAmount, couponCode);
                discountAmount = totalAmount - discountedAmount;
                totalAmount = discountedAmount;
            }
        }
        totalAmount += shippingFee;

        //Create method "SavedOrder" with data input to new order
        User user = userRepository.findById(userId).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setStatus("pending");
        order.setTotalAmount(totalAmount);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setCouponCode(couponCode);
        order.setShippingCountry(shippingCountry);
        order.setShippingAddress(shippingAddress);
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        //Save items to orderItem
        for(CartItem item : cartItemList){
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear the cart after order is placed
        cartItemRepository.deleteAll(cartItemList);

        return savedOrder;
    }
}
