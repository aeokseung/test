package com.example.firstproject.repository;

import com.example.firstproject.entity.CampingSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface CampingSiteRepository extends JpaRepository<CampingSite,Long> {
    @Override
    ArrayList<CampingSite> findAll();

    @Query(value = "select * from camping_site where city_name = :city_name", nativeQuery = true)
    ArrayList<CampingSite> findAllBySidoName(@Param("city_name") String city_name);

    @Query(value = "select * from camping_site where name like %:camping_name%", nativeQuery = true)
    ArrayList<CampingSite> findAllByCampingName(@Param("camping_name") String camping_name);
}

