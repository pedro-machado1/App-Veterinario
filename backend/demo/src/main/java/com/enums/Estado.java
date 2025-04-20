package com.enums;

import jakarta.validation.constraints.NotNull;

public class Estado {
    public enum Estados {
        AC("Acre"),
        AP("Amapá"),
        AL("Alagoas"),
        AM("Amazonas"),
        BA("Bahia"),
        CE("Ceará"),
        DF("Distrito Federal"),
        ES("Espírito Santo"),
        GO("Goiás"),
        MA("Maranhão"),
        MT("Mato Grosso"),
        MS("Mato Grosso do Sul"),
        MG("Minas Gerais"),
        PA("Pará"),
        PB("Paraíba	"),
        PR("Paraná"),
        PE("Pernambuco"),
        PI("Piauí"),
        RJ("Rio de Janeiro"),
        RN("Rio Grande do Sul"),
        RS("Rio Grande do Sul"),
        RO("Rondônia"),
        RR ("Santa Catarina"),
        SC("Santa Catarina"),
        SP("São Paulo"),
        SE("Sergipe"),
        TO("Tocantins");

        private String estado;

        Estados(String estado) {this.estado = estado;}

        public String getEstado() {return estado;}
    }
}
