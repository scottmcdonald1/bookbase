package com.liftoff.libraryapp.models;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.util.Objects;


@Entity
public class Book {

    @SequenceGenerator(
            name = "book_sequence",
            sequenceName = "book_sequence",
            allocationSize = 1
    )

    @Id
    @GeneratedValue(
            strategy = GenerationType.AUTO,
            generator = "book_sequence"
    )

    private Integer id;
    private String title;
    private String author;
    private String isbn;
    private String pages;
    private String genre;
    private String status;
    private String rating;
    private String dateAdded;
    private String dateViewed;

    @Column(length = 65555)
    private String description;

    @Column(length = 999)
    @Length(max = 999)
    private String thumbnail;

    private String userReview;
    @OneToOne
    private User user;

    public Integer getId() {
        return id;
    }

    public Book() {}
    
    public Book(Integer id, String title, String author, String isbn,
                String pages, String genre, String status, String rating, String dateAdded,
                String dateViewed, String description, String userReview, String thumbnail, User user) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.pages = pages;
        this.genre = genre;
        this.status = status;
        this.rating = rating;
        this.dateAdded = dateAdded;
        this.dateViewed = dateViewed;
        this.description = description;
        this.userReview = userReview;        
        this.thumbnail = thumbnail;
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPages() {
        return pages;
    }

    public void setPages(String pages) {
        this.pages = pages;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRating(){
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(String dateAdded) {
        this.dateAdded = dateAdded;
    }

    public String getDateViewed() {
        return dateViewed;
    }

    public void setDateViewed(String dateViewed) {
        this.dateViewed = dateViewed;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserReview() {
        return userReview;
    }

    public void setUserReview(String userReview) {
        this.userReview = userReview;
    }


    public User getUser() { return user; }
  
    public void setUser(User user) { this.user = user; }
  
    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Book book = (Book) o;
        return id.equals(book.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

