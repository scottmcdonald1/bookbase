package com.liftoff.libraryapp.repositories;

import com.liftoff.libraryapp.models.Book;
import com.liftoff.libraryapp.models.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface BookRepository extends JpaRepository<Book, Integer> {

    List<Book> findByUserIdAndStatus(Long userId, String status, Sort sort); /* WIP */

    List<Book> findByUserIdAndStatusAndRating(Long userId, String status, String rating, Sort sort); /* WIP */

    @Query(value = "SELECT SUM(pages) FROM Book WHERE STATUS = 'Completed'", nativeQuery = true)
    Integer selectPagesRead();

    @Query(value = "SELECT SUM(pages) FROM Book WHERE STATUS = 'Want to Read' OR STATUS = 'Currently Reading'", nativeQuery = true)
    Integer selectPagesToRead();

    @Query(value = "SELECT COUNT(*) FROM Book", nativeQuery = true)
    Integer selectTotalBooksInLibrary();

    @Query(value = "SELECT COUNT(*) FROM Book WHERE STATUS = 'Completed'", nativeQuery = true)
    Integer selectTotalBooksRead();

    @Query(value= "SELECT GENRE FROM BOOK GROUP BY GENRE ORDER BY COUNT(*) DESC LIMIT 1", nativeQuery = true)
    String selectFavoriteGenre();

    @Query(value= "SELECT DATE_ADDED FROM BOOK GROUP BY DATE_ADDED ORDER BY DATE_ADDED ASC LIMIT 1", nativeQuery = true)
    String selectDateOfFirstBookAdded();








}