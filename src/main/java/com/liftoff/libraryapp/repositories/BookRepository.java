package com.liftoff.libraryapp.repositories;

import com.liftoff.libraryapp.models.Book;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface BookRepository extends JpaRepository<Book, Integer> {

    List<Book> findByUserIdAndStatus(Long userId, String status, Sort sort);

    List<Book> findByUserIdAndStatusAndRating(Long userId, String status, String rating, Sort sort);

    @Query(value = "SELECT SUM(pages) FROM book WHERE STATUS = 'Completed' AND user_id = :userId", nativeQuery = true)
    Integer selectPagesRead(@Param("userId") Long userId);

    @Query(value = "SELECT SUM(pages) FROM book WHERE STATUS = 'Want to Read' OR STATUS = 'Currently Reading' AND " +
            "user_id = :userId", nativeQuery = true)
    Integer selectPagesToRead(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM book WHERE user_id = :userId", nativeQuery = true)
    Integer selectTotalBooksInLibrary(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM book WHERE STATUS = 'Completed' AND user_id = :userId", nativeQuery = true)
    Integer selectTotalBooksRead(@Param("userId") Long userId);

    @Query(value= "SELECT GENRE FROM book WHERE user_id = :userId GROUP BY GENRE ORDER BY COUNT(*) DESC LIMIT 1",
            nativeQuery = true)
    String selectFavoriteGenre(@Param("userId") Long userId);

    @Query(value= "SELECT DATE_ADDED FROM book WHERE user_id = :userId GROUP BY DATE_ADDED ORDER BY DATE_ADDED ASC " +
            "LIMIT 1", nativeQuery = true)
    String selectDateOfFirstBookAdded(@Param("userId") Long userId);








}