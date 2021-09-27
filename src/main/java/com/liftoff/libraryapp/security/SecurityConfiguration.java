package com.liftoff.libraryapp.security;

import com.liftoff.libraryapp.models.MyUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

// **** Description *** //
// Anything that goes through the /api/v*/registration/** endpoint, we want to allow/permit //
// This security class also needs a UserDetailsService class, which is why created //
// **** ********** *** //


@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final MyUserDetailsService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // Constructor
    public SecurityConfiguration(MyUserDetailsService userService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    // Override methods from WebSecurityConfigurerAdapter, which is why we extended
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // can send post without being rejected, just temporary.
                .authorizeRequests()
                    .antMatchers("/admin").hasRole("ADMIN")
                    .antMatchers("/user/**").authenticated()
                    .antMatchers("/registration/**", "/", "/resources/**").permitAll()
//                 .anyRequest().authenticated()
                .and().formLogin()
                    .loginPage("/login")
                    .failureUrl("/login?error")
                    .permitAll()
                    .usernameParameter("email")
                    .defaultSuccessUrl("/user/shelf", true)
                .and().logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                    .logoutSuccessUrl("/login?logout")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID");

                // TODO: remember me
                // TODO: forgot password
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }
}
