package com.app.util;

import com.app.dto.MovieDto;

public class IdMapper {

    public static String getIMDbMovieId(Long id) {
        String idString = String.valueOf(id);
        int numDigits = idString.length();
        String paddedId = String.format("%1$" + (9 - numDigits) + "s", idString)
                .replace(' ', '0');
        return "tt" + paddedId;
    }

    public static String getIMDbPersonId(Long id) {
        String idString = String.valueOf(id);
        int numDigits = idString.length();
        String paddedId = String.format("%1$" + (9 - numDigits) + "s", idString)
                .replace(' ', '0');
        return "nm" + paddedId;
    }

    public static Long getLongFromString(String s) {
        String digitsOnly = s.replaceAll("\\D", "");
        return Long.parseLong(digitsOnly);
    }
}
