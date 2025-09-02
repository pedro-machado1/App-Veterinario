package com.enums;


import com.fasterxml.jackson.annotation.JsonValue;

public enum Estado {

    AC("Acre"),
    AP("Amapá"),
    AL("Alagoas"),
    AM("Amazonas"),
    BA("Bahia"),
    CE("Ceará"),
    DF("DistritoFederal"),
    ES("EspíritoSanto"),
    GO("Goiás"),
    MA("Maranhão"),
    MT("MatoGrosso"),
    MS("MatoGrossodoSul"),
    MG("MinasGerais"),
    PA("Pará"),
    PB("Paraíba"),
    PR("Paraná"),
    PE("Pernambuco"),
    PI("Piauí"),
    RJ("RiodeJaneiro"),
    RN("RioGrandedoNorte"),
    RS("RioGrandedoSul"),
    RO("Rondônia"),
    RR ("Roraima"),
    SC("SantaCatarina"),
    SP("SãoPaulo"),
    SE("Sergipe"),
    TO("Tocantins");

    private final String estado;

    Estado(String estado) {this.estado = estado;}

    @JsonValue
    public String getEstado() {return estado;}

}
