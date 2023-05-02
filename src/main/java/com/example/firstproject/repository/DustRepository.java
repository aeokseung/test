package com.example.firstproject.repository;

import com.example.firstproject.entity.Dust;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface DustRepository extends JpaRepository<Dust,Long> {
    @Override
    ArrayList<Dust> findAll();

    @Query(value = "select * from dust where sido_name = :sido_name ORDER BY station_name", nativeQuery = true)
    ArrayList<Dust> findAllBySidoName(@Param("sido_name") String sido_name);

    @Query(value = "select * from dust where station_name = :station_name" , nativeQuery = true)
    ArrayList<Dust> findAllByStationName(@Param("station_name") String station_name);

    @Query(value = "ALTER TABLE dust AUTO_INCREMENT=1", nativeQuery = true)
    void initialization();
}

