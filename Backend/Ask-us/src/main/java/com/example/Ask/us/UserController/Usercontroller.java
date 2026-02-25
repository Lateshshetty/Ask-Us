package com.example.Ask.us.UserController;

import com.example.Ask.us.Module.Users;
import com.example.Ask.us.Repo.repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api")
public class Usercontroller {


    @Autowired
    private repo repository;

    @GetMapping("/me")
    public ResponseEntity<?> getauth(Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        OAuth2User oAuth2User = (OAuth2User) auth.getPrincipal();

        String email = oAuth2User.getAttribute("email");

        String name = oAuth2User.getAttribute("name");

        String picture = oAuth2User.getAttribute("picture");

        Users user =new Users();

        user=repository.findByEmail(email);

        if(user==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return  ResponseEntity.ok(Map.of("email",email,"name",name,"picture", picture != null ? picture : ""));


    }
}
