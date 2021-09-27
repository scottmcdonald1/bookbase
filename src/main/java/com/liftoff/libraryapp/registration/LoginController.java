package com.liftoff.libraryapp.registration;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("login")
    public String displayLoginForm(Model model) {
        model.addAttribute("title", "Log In | Bookbase");
        return "security/login";
    }

}
