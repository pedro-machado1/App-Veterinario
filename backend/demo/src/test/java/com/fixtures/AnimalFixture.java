package com.fixtures;

import com.enums.Genero;
import com.model.Animal;

public class AnimalFixture {

    public static Animal animalFixture(){
        Animal animal = new Animal();
        animal.setNome("Nina");
        animal.setIdade(5);
        animal.setEspecie("Cachorro");
        animal.setRaca("Pastor");
        animal.setAltura(120);
        animal.setPeso(100);
        animal.setComprimento(25);
        animal.setDoenca("Doença");
        animal.setGenero(Genero.M);
        animal.setRaca("Pastor Alemão");
        return animal;
    }
}
