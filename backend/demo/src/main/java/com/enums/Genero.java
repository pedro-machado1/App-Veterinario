package com.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Genero {
    F("Feminino"),
    M("Masculino");

    final private String genero;

    Genero(String genero) {this.genero = genero;}

    @JsonValue
    public String getGenero() {return genero;}

}
