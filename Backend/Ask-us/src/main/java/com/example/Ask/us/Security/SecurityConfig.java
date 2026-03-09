package com.example.Ask.us.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final OAuthSuccessHandler oAuthSuccessHandler;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;


    public SecurityConfig(OAuthSuccessHandler oAuthSuccessHandler) {
        this.oAuthSuccessHandler = oAuthSuccessHandler;
    }
    @Bean
    public SecurityFilterChain  Securityfil(HttpSecurity http) throws Exception {

        http.csrf(cust->cust.disable())
        .cors(cust->cust.configurationSource(CorsCOnfig()))

                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers("/","/error","/login**","/oauth2/**").permitAll().anyRequest().authenticated())

                .oauth2Login(auth->auth.successHandler(oAuthSuccessHandler))
                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                (request, response, authException) -> {
                                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                    response.getWriter().write("Unauthorized");
                                },
                                new AntPathRequestMatcher("/api/**")
                        )
                )
                .logout(log -> log
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                );
        return http.build();

    }

@Bean
    public CorsConfigurationSource CorsCOnfig() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(List.of("*"));
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return  source;
    }
//    @Bean
//    public CookieSameSiteSupplier cookieSameSiteSupplier() {
//        return CookieSameSiteSupplier.ofNone();
//    }
}
