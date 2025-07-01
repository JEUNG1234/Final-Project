package com.kh.sowm.repository;

import com.kh.sowm.entity.ProfileImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class ProfileImgRepositoryImpl implements ProfileImgRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public void save(ProfileImage oldImg) {
        em.persist(oldImg);
    }
}
