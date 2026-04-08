package com.alexshop.backend.service;

import com.alexshop.backend.entity.*;
import com.alexshop.backend.repository.*;
import jakarta.transaction.Transactional;
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
    private final ProductRepository productRepository;

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
    @Transactional
    public Order cancelOrder(Integer orderId){
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus("cancelled");

        // 還原庫存
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        return orderRepository.save(order);
    }

    // 下單前檢查庫存
    public void checkStock(Integer userId) {
        List<CartItem> cartItemList = cartItemRepository.findByUserId(userId);
        for (CartItem item : cartItemList) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException(product.getNameJa() + " の在庫が不足しています");
            }
        }
    }

    //Create order. Need inject Repositories and Services
    //including CartItem, OrderItem, Coupon, ShippingFee
    //Need to know who is placing order, coupon used, delivery country
    @Transactional(rollbackOn = Exception.class)
    public Order createOrder(Integer userId, String couponCode, String shippingCountry, String shippingAddress){
        List<CartItem> cartItemList = cartItemRepository.findByUserId(userId);

        // 檢查庫存
        for (CartItem item : cartItemList) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException(product.getNameJa() + " の在庫が不足しています");
            }
        }
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

        //Save items to orderItem and deduct stock
        for(CartItem item : cartItemList){
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getProduct().getPrice());
            orderItemRepository.save(orderItem);

            // 扣庫存
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // Clear the cart after order is placed
        cartItemRepository.deleteAll(cartItemList);

        return savedOrder;
    }
}
