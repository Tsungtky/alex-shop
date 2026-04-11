package com.alexshop.backend.service;

import com.alexshop.backend.entity.Product;
import com.alexshop.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    //Get all products
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    //Get product by ID
    public Product getProductByID(Integer productId){
        return productRepository.findById(productId).orElseThrow();
    }

    //Add new product
    public Product addNewProduct(Product product){
        product.setCreatedAt(LocalDateTime.now());
        product.setStatus("active");
        return productRepository.save(product);
    }

    //Archive product (soft delete)
    public Product archiveProduct(Integer productId){
        Product product = productRepository.findById(productId).orElseThrow();
        product.setStatus("archived");
        return productRepository.save(product);
    }

    //Update product
    public Product updateProduct(Product product){
        return productRepository.save(product);
    }

    //Delete product
    public void deleteProductById(Integer productId){
        productRepository.deleteById(productId);
    }

}
