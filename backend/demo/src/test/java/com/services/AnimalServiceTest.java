package com.services;


import com.model.Animal;
import com.repository.AnimalRepository;
import com.service.AnimalService;
import com.fixtures.AnimalFixture;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AnimalServiceTest {

    @InjectMocks
    private AnimalService animalService;

    @Mock
    private AnimalRepository animalRepository;

    @Test
    void InserirAnimalSucesso() {

        Animal animal = AnimalFixture.animalFixture();
        when(animalRepository.save(any(Animal.class))).thenReturn(animal);

        animalRepository.save(animal);

        assertNotNull(animal);
        assertEquals("Nina", animal.getNome());
    }
}
