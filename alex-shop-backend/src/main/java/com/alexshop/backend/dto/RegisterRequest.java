package com.alexshop.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "名前を入力してください")
    private String firstName;

    @NotBlank(message = "苗字を入力してください")
    private String lastName;

    @Email(message = "メールアドレスの形式が正しくありません")
    @NotBlank(message = "メールアドレスを入力してください")
    private String email;

    @NotBlank(message = "パスワードを入力してください")
    @Size(min = 8, message = "パスワードは8文字以上で入力してください")
    private String password;
}
