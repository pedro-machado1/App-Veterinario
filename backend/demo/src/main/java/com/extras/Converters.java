package com.extras;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class Converters {
    private static final ModelMapper modelMapper;

    static {
        modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setSkipNullEnabled(true); //  THIS IS THE KEY CHANGE
    }

    public static <D, E> D convertToDto(E entity, Class<D> dtoClass) {
        return modelMapper.map(entity, dtoClass);
    }

    public static <D, E> E convertToEntity(D dto, Class<E> entityClass) {
        return modelMapper.map(dto, entityClass);
    }

    public static <D, E> void convertToEntityVoid(D dto, E entityClass) {
        modelMapper.map(dto, entityClass);
    }


}
