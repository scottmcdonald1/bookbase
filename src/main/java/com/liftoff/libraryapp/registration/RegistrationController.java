package com.liftoff.libraryapp.registration;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

// **** Description *** //
// This class is a controller that handles User Registration requests //
// It receives a RegistrationRequest object and triggers the RegistrationService //
// **** ********** *** //

@Controller
@RequestMapping("registration")
public class RegistrationController {

    // Field
    private final RegistrationService registrationService;

    // Constructor
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public String showRegistration(Model model) {
        model.addAttribute("request", new RegistrationRequest());
        model.addAttribute("title", "Sign Up | Bookbase");

        return "security/signup_form";
    }

    @GetMapping
    @RequestMapping("/confirm_email")
    public String showEmailConfirm(){
        return "/security/confirm_email";
    }
    @PostMapping
    public String processRegistration(RegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping(path = "confirm")
    public String confirmRegistration(@RequestParam("token") String token) {
        return registrationService.confirmToken(token);
    }
}
