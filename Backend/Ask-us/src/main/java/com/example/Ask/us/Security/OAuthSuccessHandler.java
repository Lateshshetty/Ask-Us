package com.example.Ask.us.Security;

import com.example.Ask.us.Module.Users;
import com.example.Ask.us.Repo.repo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private repo userrepo;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public  void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)throws IOException {
        OAuth2User  oAuth2User;
        oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");


        if (userrepo.findByEmail(email) == null) {
            Users user = new Users();
            user.setName(name);
            user.setEmail(email);
            user.setProvider("Google");
            user.setRole("ROLE_USER");
            userrepo.save(user);

        }


        getRedirectStrategy().sendRedirect(request, response,frontendUrl);


    }



}
