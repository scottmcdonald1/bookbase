package com.liftoff.libraryapp.registration;

import com.liftoff.libraryapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UserRepository userRepository;

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
    public String showEmailConfirm(Model model) {
        model.addAttribute("title", "Registration Complete | Bookbase");
        return "/security/confirm_email";
    }
    @PostMapping
    public String processRegistration(@ModelAttribute("request") RegistrationRequest request, Model model) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            model.addAttribute("userTakenError", "That email address is taken. Try another.");
            model.addAttribute("title", "Sign Up | Bookbase");
            return "security/signup_form";
        }

        return registrationService.register(request);
    }

    @GetMapping(path = "confirm")
    public String confirmRegistration(@RequestParam("token") String token) {
        return registrationService.confirmToken(token);
    }
}
