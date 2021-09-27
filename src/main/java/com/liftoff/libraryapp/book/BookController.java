package com.liftoff.libraryapp.book;

import com.liftoff.libraryapp.models.Book;
import com.liftoff.libraryapp.models.MyUserDetailsService;
import com.liftoff.libraryapp.models.User;
import com.liftoff.libraryapp.repositories.BookRepository;
import com.liftoff.libraryapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@RequestMapping("user")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("add")
    public String displayAddBookForm(Model model) {
        model.addAttribute(new Book());
        model.addAttribute("title", "Add Book | Bookbase");

        return "book/add";
    }

    @PostMapping("add")
    public String processAddBookForm(@ModelAttribute @Valid Book newBook,
                                     Errors errors, Model model, @RequestParam String title, @RequestParam String author, @RequestParam String isbn,
                                     @RequestParam String pages, @RequestParam String genre, @RequestParam String status, @RequestParam String rating,
                                     @RequestParam String description, @RequestParam String userReview) {
        if (errors.hasErrors()) {
            return "/add";
        }

        DateFormat Date = DateFormat.getDateInstance();
        Calendar cals = Calendar.getInstance();
        String currentDate = Date.format(cals.getTime());
        model.addAttribute("date", currentDate);

        newBook.setDateAdded(currentDate);
        newBook.setThumbnail("https://www.syndetics.com/index.aspx?isbn="+ isbn +"/LC.JPG");

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);

        newBook.setUser(user);

        newBook.setDateAdded(currentDate);
        bookRepository.save(newBook);

        return "redirect:shelf";
    }

    @GetMapping("delete")
    public String displayDeleteBooksForm(Model model) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);

        List<List<Book>> bookLists = new ArrayList<>();

        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading", Sort.by("dateViewed")));
        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Want to Read", Sort.by("title")));
        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Completed", Sort.by("title")));
        model.addAttribute("bookLists", bookLists);
        model.addAttribute("title", "Remove Books | Bookbase");

        return "book/delete";
    }

    @PostMapping("delete")
    public String processDeleteBooksForm(@RequestParam(required = false) int[] bookIds) {
        if (bookIds != null) {
            for (int id : bookIds) {
                bookRepository.deleteById(id);
            }
        }
        return "redirect:delete";
    }

    @GetMapping("edit/{bookId}")
    public String displayEditForm(Model model, @PathVariable Integer bookId) {
        Optional optBook = bookRepository.findById(bookId);
        if (optBook.isPresent()) {
            Book book = (Book) optBook.get();
            model.addAttribute("book", book);
            model.addAttribute("title", "Edit - " + book.getTitle() + " | Bookbase");
            return "book/edit";
        } else {
            return "redirect:../";
        }
    }

    @PostMapping("edit")
    public String processEditForm(Model model, @RequestParam Integer bookId, String title, String author, String isbn,
                                  String pages, String genre, String status, String rating, String description, String userReview) {
        Optional optBook = bookRepository.findById(bookId);
        if (optBook.isPresent()) {
            Book book = (Book) optBook.get();
            model.addAttribute("book", book);
            book.setTitle(title);
            book.setAuthor(author);
            book.setIsbn(isbn);
            book.setPages(pages);
            book.setGenre(genre);
            book.setStatus(status);
            book.setRating(rating);
            book.setDescription(description);
            book.setUserReview(userReview);
            book.setDateAdded(book.getDateAdded());
            bookRepository.save(book);
            return "redirect:shelf";
        } else {
            return "redirect:";
        }
    }

    @RequestMapping("shelf")
    public String displayMainBookshelf(Model model) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);

        List<List<Book>> bookLists = new ArrayList<>();

        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading",
                Sort.by("dateViewed").descending()));
        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Want to Read", Sort.by("title")));
        bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Completed", Sort.by("title")));
        model.addAttribute("bookLists", bookLists);

        model.addAttribute("title", "My Shelves | Bookbase");

        return "book/shelf";
    }

    @PostMapping("shelf")
    public String displayMainBookshelf(Model model, @RequestParam (required = false) String status,
                                       @RequestParam (required = false, defaultValue = "title") String orderBy,
                                       @RequestParam (required = false) String rating) {

        model.addAttribute("title", "My Shelves | Bookbase");

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User user = (User) myUserDetailsService.loadUserByUsername(username);

        List<List<Book>> bookLists = new ArrayList<>();

        if (!rating.equals("")) {
            if (orderBy.equals("dateViewed") || orderBy.equals("dateAdded")) {
                bookLists.add(bookRepository.findByUserIdAndStatusAndRating(user.getId(), "Completed", rating,
                        Sort.by(orderBy).descending()));
            } else {
                bookLists.add(bookRepository.findByUserIdAndStatusAndRating(user.getId(), "Completed", rating,
                        Sort.by(orderBy)));
            }

            model.addAttribute("bookLists", bookLists);
            return "book/shelf";
        }

        if (!status.equals("")) {
            if (orderBy.equals("dateViewed") || orderBy.equals("dateAdded")) {
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), status, Sort.by(orderBy).descending()));
            } else {
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), status, Sort.by(orderBy)));
            }
        } else {
            if (orderBy.equals("dateViewed") || orderBy.equals("dateAdded")) {
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading",
                        Sort.by(orderBy).descending()));
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Want to Read",
                        Sort.by(orderBy).descending()));
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Completed",
                        Sort.by(orderBy).descending()));
            } else {
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Currently Reading", Sort.by(orderBy)));
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Want to Read", Sort.by(orderBy)));
                bookLists.add(bookRepository.findByUserIdAndStatus(user.getId(), "Completed", Sort.by(orderBy)));
            }
        }
        model.addAttribute("bookLists", bookLists);

        return "book/shelf";
    }

    @GetMapping("view/{bookId}")
    public String displayViewBook(Model model, @PathVariable (required = false) Integer bookId) {
        Optional<Book> optBook = bookRepository.findById(bookId);
        if (optBook.isPresent()) {
            Book book = (Book) optBook.get();
            model.addAttribute("book", book);
            Date date = new Date();
            Timestamp ts = new Timestamp(date.getTime());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH::mm:ss");
            String dateViewed = formatter.format(ts);
            model.addAttribute("dateViewed", dateViewed);
            book.setDateViewed(dateViewed);
            bookRepository.save(book);

            model.addAttribute("title", book.getTitle() + " | Bookbase");

            return "book/view";
        } else {
            return "redirect:../shelf";
        }
    }
}
