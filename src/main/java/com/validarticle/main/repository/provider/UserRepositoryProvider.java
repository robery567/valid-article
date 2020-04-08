package com.validarticle.main.repository.provider;

import com.validarticle.main.model.User;
import com.validarticle.main.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class UserRepositoryProvider implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final PasswordEncoder passwordEncoder;

    UserRepositoryProvider(final JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        super();
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User getIdByUsername(String username) {
        return jdbcTemplate.queryForObject(
                "SELECT `id`, `email`, `password` FROM `user` WHERE `username` = ? LIMIT 1",
                new Object[]{username},
                (rs, rowNum) -> new User(rs.getInt("id"), rs.getString("email"), rs.getString("password"))
        );
    }

    @Override
    public void save(User user) {
        jdbcTemplate.update(
                "INSERT INTO `user` (`username`, `email`, `password`, `creation_date`) VALUES (?, ?, ?, ?)",
                user.getUsername(),
                user.getEmail(),
                passwordEncoder.encode(user.getPassword()),
                user.getCreationDate()
        );
    }

}