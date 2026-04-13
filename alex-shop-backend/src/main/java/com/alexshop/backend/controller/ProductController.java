package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Product;
import com.alexshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/admin")
    public List<Product> getAllProductsForAdmin(){
        return productService.getAllProductsForAdmin();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Integer id){
        return productService.getProductByID(id);
    }

    @PostMapping
    public Product addNewProduct(@RequestBody Product product){
        return productService.addNewProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product product){
        return productService.updateProduct(product);
    }

    @PutMapping("/{id}/archive")
    public Product archiveProduct(@PathVariable Integer id){
        return productService.archiveProduct(id);
    }

    @PutMapping("/{id}/unarchive")
    public Product unarchiveProduct(@PathVariable Integer id){
        return productService.unarchiveProduct(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Integer id){
         productService.deleteProductById(id);
    }
}
