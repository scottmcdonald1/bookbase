package com.liftoff.libraryapp.landing;


import com.liftoff.libraryapp.models.Book;
import com.liftoff.libraryapp.models.MyUserDetailsService;
import com.liftoff.libraryapp.models.User;
import com.liftoff.libraryapp.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Value("${googleKey}")
    private String googleKey;

    @Value("${nytKey}")
    private String nytKey;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String displayHomePage(Model model, Principal currentUser) {

        if (currentUser != null) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails)principal).getUsername();
            User user = (User) myUserDetailsService.loadUserByUsername(username);
            String name = user.getFirstName();
            model.addAttribute("name", name);

            List<List<Book>> recentBooks = new ArrayList<>();

            recentBooks.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading", Sort.by("dateViewed").descending()));
            model.addAttribute("recentBooks", recentBooks);

            model.addAttribute("title", "Home | Bookbase");
            model.addAttribute("googleKey", googleKey);
            model.addAttribute("nytKey", nytKey);

            return "home";
        }
        model.addAttribute("title", "Bookbase - Manage Your Own Personal Library");
        model.addAttribute("googleKey", googleKey);
        model.addAttribute("nytKey", nytKey);

        return "index";
    }

    @GetMapping("home")
    public String processBestsellersForm(Model model, @RequestParam String genre) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);
        String name = user.getFirstName();
        model.addAttribute("name", name);

        List<List<Book>> recentBooks = new ArrayList<>();

        recentBooks.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading", Sort.by("dateViewed").descending()));
        model.addAttribute("recentBooks", recentBooks);

        model.addAttribute("genre", genre);
        return "home";
    }
}
