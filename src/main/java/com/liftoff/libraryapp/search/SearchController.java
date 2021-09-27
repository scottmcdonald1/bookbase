package com.liftoff.libraryapp.search;

import com.liftoff.libraryapp.models.Book;
import com.liftoff.libraryapp.models.MyUserDetailsService;
import com.liftoff.libraryapp.models.User;
import com.liftoff.libraryapp.repositories.BookRepository;
import com.mysql.cj.jdbc.Blob;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("user")
public class SearchController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Value("${googleKey}")
    private String googleKey;

    @GetMapping("search")
    public String displaySearchForm(Model model) {
        model.addAttribute("title", "Search | Bookbase");
        return "search/search";
    }

    @PostMapping("/search")
    public String processSearchForm(Model model, String searchQuery, String searchParameter, String resultsPerPage) {

        String newQuery = "";
        String queryToPathVariable = searchQuery.toLowerCase().replace(' ', '+');

        if(searchParameter == null || searchParameter.equals("all")) {
            newQuery += queryToPathVariable;
        } else {
            searchParameter += ":";
            newQuery += searchParameter + queryToPathVariable;
        }

        int pageNumber = 1;
        String currentPage = "&page=" + pageNumber;
        if (resultsPerPage == null) {
            resultsPerPage = "10";
        }
        String maxResults = "&maxResults=" + resultsPerPage;
        String searchOptions = maxResults + currentPage;

        model.addAttribute("formAction", "search/");

        return "redirect:results/q=" + newQuery + searchOptions;
    }

    @GetMapping("search/results/q={query}&maxResults={maxResults}&page={currentPage}")
    public String displaySearchResults(Model model, @PathVariable String query, @PathVariable int currentPage, @PathVariable int maxResults) {
        String searchQuery;

        String searchParameter;
        String displayParameter;

        List<String> pathParameters = new ArrayList<>(Arrays.asList("intitle", "inauthor", "subject", "isbn"));
        List<String> displayParameters = new ArrayList<>(Arrays.asList("title", "author", "genre", "isbn"));

        if (query.contains(":")) {
            String[] queryArray = query.split(":", 0);
            searchParameter = queryArray[0];
            displayParameter = displayParameters.get(pathParameters.indexOf(queryArray[0]));

            searchQuery = queryArray[1].replaceAll("[+]", " ");
        } else {
            searchParameter = null;
            displayParameter = "all";
            searchQuery = query.replaceAll("[+]", " ");
        }

        model.addAttribute("searchParameter", searchParameter);
        model.addAttribute("displayParameter", displayParameter);
        model.addAttribute("maxResults", maxResults);
        model.addAttribute("searchQuery", searchQuery);
        model.addAttribute("query", query);
        model.addAttribute("pageNumber", currentPage);
        model.addAttribute("startIndex", (currentPage-1) * maxResults);
        model.addAttribute("googleKey", googleKey);

        model.addAttribute("title", "Search: " + query + " | Bookbase");

        return "search/results";
    }

    @GetMapping("search/results/view/{bookId}")
    public String displayViewBook(Model model, @PathVariable String bookId) {
        model.addAttribute("bookId", bookId);
        model.addAttribute(new Book());

        List<Book> allBooksInRepo = new ArrayList<>();
        List<String> bookRepositoryIsbns;
        List<Integer> bookRepositoryIds;

        bookRepository.findAll().forEach(allBooksInRepo::add);
        bookRepositoryIsbns = allBooksInRepo.stream().map(Book::getIsbn).collect(Collectors.toList());
        bookRepositoryIds = allBooksInRepo.stream().map(Book::getId).collect(Collectors.toList());

        model.addAttribute("bookRepositoryIds", bookRepositoryIds);
        model.addAttribute("bookRepositoryIsbns", bookRepositoryIsbns);

        model.addAttribute("title", "Search Result | Bookbase");
        model.addAttribute("googleKey", googleKey);

        return "search/view";
    }

    @PostMapping("search/results/view/{bookId}")
    public String processAddBook(@ModelAttribute @Valid Book newBook, Errors errors, Model model, @RequestParam String title,
                                 @RequestParam String author, @RequestParam String isbn, @RequestParam String pages,
                                 @RequestParam String genre, @RequestParam String status, @RequestParam String rating,
                                 @RequestParam String description, @RequestParam String thumbnail, @PathVariable String bookId) {
        if(errors.hasErrors()) {
            return "search/view/{bookId}";
        }

        model.addAttribute("title", title);
        model.addAttribute("author", author);
        model.addAttribute("isbn", isbn);
        model.addAttribute("pages", pages);
        model.addAttribute("genre", genre);
        model.addAttribute("status", status);
        model.addAttribute("rating", rating);
        model.addAttribute("description", description);
        model.addAttribute("thumbnail", thumbnail);

        DateFormat Date = DateFormat.getDateInstance();
        Calendar cals = Calendar.getInstance();
        String currentDate = Date.format(cals.getTime());
        model.addAttribute("date", currentDate);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);

        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setIsbn(isbn);
        newBook.setPages(pages);
        newBook.setGenre(genre);
        newBook.setStatus(status);
        newBook.setRating(rating);
        newBook.setDateAdded(currentDate);
        newBook.setDescription(description);
        newBook.setThumbnail(thumbnail);
        newBook.setUser(user);

        bookRepository.save(newBook);

        return "redirect:{bookId}";
    }

}
