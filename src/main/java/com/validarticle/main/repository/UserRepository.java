package com.validarticle.main.repository;

import com.validarticle.main.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {
    /**
     * Gets the user with username = {username}
     * @param username the username of the user to find
     * @return an User
     */
    User getIdByUsername(String username);

    User getUserById(String userId);

    /**
     * Persists the user and encodes its password
     * @param user the user to persist
     */
    void save(User user);
}