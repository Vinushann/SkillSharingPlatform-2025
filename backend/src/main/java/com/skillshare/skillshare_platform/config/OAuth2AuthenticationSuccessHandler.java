package com.skillshare.skillshare_platform.config;

import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.user_management.repositories.AppUserRepository;
import com.skillshare.skillshare_platform.security.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final AppUserRepository userRepository;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider,
                                              AppUserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Optional<AppUser> optionalUser = userRepository.findByEmail(email);

        AppUser user = optionalUser.orElseGet(() -> {
            AppUser newUser = new AppUser();
            newUser.setEmail(email);
            newUser.setFirstName(oAuth2User.getAttribute("name"));
            newUser.setLastName("");
            newUser.setPassword("password123");
            newUser.setProfileImageUrl(
                    "https://i.pinimg.com/474x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg");
            newUser.setUsername(email); // or generate a username
            return userRepository.save(newUser);
        });

        if (user.isDeactivateStatus()) {
            Date now = new Date();
            Date deactivateEndDate = user.getDeactivateEndDate();

            if (deactivateEndDate != null && now.after(deactivateEndDate)) {
                // Deactivation expired, reset status and dates
                user.setDeactivateStatus(false);
                user.setDeactivateStartDate(null);
                user.setDeactivateEndDate(null);
                userRepository.save(user);
            } else {
                // Still deactivated, redirect with error message
                String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login-error")
                        .queryParam("message", "Your account has been deactivated. Please contact support.")
                        .toUriString();
                getRedirectStrategy().sendRedirect(request, response, targetUrl);
                return; // Stop further processing
            }
        }

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);
        System.out.println("Token value: " + token);
        System.out.println("User ID value: " + user.getId());

        // Build redirect URL with token and user ID
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login/oauth2/code/google")
                .queryParam("token", token)
                .queryParam("userId", user.getId())
                .toUriString();
        System.out.println("Redirecting to: " + targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
