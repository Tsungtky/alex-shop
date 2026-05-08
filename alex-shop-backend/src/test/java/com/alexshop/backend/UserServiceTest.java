import com.alexshop.backend.dto.RegisterRequest;
import com.alexshop.backend.entity.User;
import com.alexshop.backend.repository.UserRepository;
import com.alexshop.backend.service.TokenBlacklistService;
import com.alexshop.backend.service.UserService;
import com.alexshop.backend.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    BCryptPasswordEncoder passwordEncoder;

    @Mock
    JwtUtil jwtUtil;

    @Mock
    TokenBlacklistService tokenBlacklistService;

    @InjectMocks
    UserService userService;

    private User makeUser(String email) {
        User u = new User();
        u.setEmail(email);
        return u;
    }

    @Test
    void registerUser_emailAlreadyExists_shouldThrow() {
        when(userRepository.findByEmail("test12345@test.com")).thenReturn(new User());

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test12345@test.com");

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("メールアドレスはすでに使用されています");
    }

    @Test
    void registerUser_success() {

    }
}