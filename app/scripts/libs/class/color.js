function Color( color ) {
    this.rgb = null;
    this.hsl = null;
    this.opacity = 1;
    this.hex = null;
    this.name = null;

    color = color.replace( " ", "" );

    if ( Color.isRGB( color ) ) {
        this.rgb = Color.extractRGB( color );
        this.hex = Color.RGBToHex( this.rgb );

    } else if ( Color.isRGBA( color ) ) {
        var rgba = Color.extractRGBA( color );
        this.opacity = rgba.a;
        this.rgb = { r: rgba.r, g: rgba.g, b: rgba.b };
        this.hex = Color.RGBToHex( this.rgb );

    } else if ( Color.isHSL( color ) ) {
        this.hsl = Color.extractHSL( color );
        this.rgb = Color.HSLToRGB( this.hsl );
        this.hex = Color.RGBToHex( this.rgb );

    } else if ( Color.isHSLA( color ) ) {        
        var hsla = Color.extractHSLA( color );
        this.opacity = hsla.a;
        this.hsl = { h: hsla.h, s: hsla.s, l: hsla.l };
        this.rgb = Color.HSLToRGB( this.hsl );
        this.hex = Color.RGBToHex( this.rgb );

    } else if ( Color.isColor( color ) ) {
        this.hex = Color.ColorToHex( color );

    } else if ( Color.isHex( color ) ) {
        this.hex = Color.formatHex( color );

    } else if ( Color.isHexa( color ) ) {
        this.hex = Color.formatHex( color );
        this.opacity = Color.hexToOpacity( color.substr( 1, 2 ) );
    }

    if ( this.hex !== null ) {
        if ( !this.rgb ) this.rgb = Color.HexToRGB( this.hex );
        if ( !this.hsl ) this.hsl = Color.RGBToHSL( this.rgb );
        this.name = Color.HexToColor( this.hex );

    }
}

Color.prototype.get = function( property ) {
    switch ( property ) {
        case "name":
            return this.name;

        case "rgb":
            return new Array( this.rgb.r, this.rgb.g, this.rgb.b );

        case "rgba":
            return new Array( this.rgb.r, this.rgb.g, this.rgb.b, this.opacity );

        case "hsl":
            return new Array( this.hsl.h, this.hsl.s + "%", this.hsl.l + "%" );

        case "hsla":
            return new Array( this.hsl.h, this.hsl.s + "%", this.hsl.l + "%", this.opacity );

        case "hex":
            return this.hex;

        case "hexa":
            return "#" + Color.opacityToHex( this.opacity ) + this.hex.substr( 1 );

        case "opacity":
            return this.opacity;
    }
}

Color.prototype.getCSS = function( property ) {
    switch ( property ) {
        case "name":
            return this.name;

        case "rgb":
            return "rgb(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ")";

        case "rgba":
            return "rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + "," + this.opacity + ")";

        case "hsl":
            return "hsl(" + this.hsl.h + "," + this.hsl.s + "%," + this.hsl.l + "%)";

        case "hsla":
            return "hsla(" + this.hsl.h + "," + this.hsl.s + "%," + this.hsl.l + "%," + this.opacity + ")";

        case "hex":
            return this.hex;

        case "hexa":
            return "#" + Color.opacityToHex( this.opacity ) + this.hex.substr( 1 );

        case "opacity":
            return this.opacity;
    }
}

Color.prototype.getOpacityRGB = function (opacity) {
    return 'rgba(' + this.rgb.r + ',' + this.rgb.g + ',' + this.rgb.b + ',' + opacity + ')';
}

/**
 * An array of web based colors names
 * @see    http://www.w3schools.com/Html/html_colornames.asp
 */
Color.names = {
    "AliceBlue": "#F0F8FF",
    "AntiqueWhite": "#FAEBD7",
    "Aqua": "#00FFFF",
    "Aquamarine": "#7FFFD4",
    "Azure": "#F0FFFF",
    "Beige": "#F5F5DC",
    "Bisque": "#FFE4C4",
    "Black": "#000000",
    "BlanchedAlmond": "#FFEBCD",
    "Blue": "#0000FF",
    "BlueViolet": "#8A2BE2",
    "Brown": "#A52A2A",
    "BurlyWood": "#DEB887",
    "CadetBlue": "#5F9EA0",
    "Chartreuse": "#7FFF00",
    "Chocolate": "#D2691E",
    "Coral": "#FF7F50",
    "CornflowerBlue": "#6495ED",
    "Cornsilk": "#FFF8DC",
    "Crimson": "#DC143C",
    "Cyan": "#00FFFF",
    "DarkBlue": "#00008B",
    "DarkCyan": "#008B8B",
    "DarkGoldenRod": "#B8860B",
    "DarkGray": "#A9A9A9",
    "DarkGrey": "#A9A9A9",
    "DarkGreen": "#006400",
    "DarkKhaki": "#BDB76B",
    "DarkMagenta": "#8B008B",
    "DarkOliveGreen": "#556B2F",
    "Darkorange": "#FF8C00",
    "DarkOrchid": "#9932CC",
    "DarkRed": "#8B0000",
    "DarkSalmon": "#E9967A",
    "DarkSeaGreen": "#8FBC8F",
    "DarkSlateBlue": "#483D8B",
    "DarkSlateGray": "#2F4F4F",
    "DarkSlateGrey": "#2F4F4F",
    "DarkTurquoise": "#00CED1",
    "DarkViolet": "#9400D3",
    "DeepPink": "#FF1493",
    "DeepSkyBlue": "#00BFFF",
    "DimGray": "#696969",
    "DimGrey": "#696969",
    "DodgerBlue": "#1E90FF",
    "FireBrick": "#B22222",
    "FloralWhite": "#FFFAF0",
    "ForestGreen": "#228B22",
    "Fuchsia": "#FF00FF",
    "Gainsboro": "#DCDCDC",
    "GhostWhite": "#F8F8FF",
    "Gold": "#FFD700",
    "GoldenRod": "#DAA520",
    "Gray": "#808080",
    "Grey": "#808080",
    "Green": "#008000",
    "GreenYellow": "#ADFF2F",
    "HoneyDew": "#F0FFF0",
    "HotPink": "#FF69B4",
    "IndianRed": "#CD5C5C",
    "Indigo": "#4B0082",
    "Ivory": "#FFFFF0",
    "Khaki": "#F0E68C",
    "Lavender": "#E6E6FA",
    "LavenderBlush": "#FFF0F5",
    "LawnGreen": "#7CFC00",
    "LemonChiffon": "#FFFACD",
    "LightBlue": "#ADD8E6",
    "LightCoral": "#F08080",
    "LightCyan": "#E0FFFF",
    "LightGoldenRodYellow": "#FAFAD2",
    "LightGray": "#D3D3D3",
    "LightGrey": "#D3D3D3",
    "LightGreen": "#90EE90",
    "LightPink": "#FFB6C1",
    "LightSalmon": "#FFA07A",
    "LightSeaGreen": "#20B2AA",
    "LightSkyBlue": "#87CEFA",
    "LightSlateGray": "#778899",
    "LightSlateGrey": "#778899",
    "LightSteelBlue": "#B0C4DE",
    "LightYellow": "#FFFFE0",
    "Lime": "#00FF00",
    "LimeGreen": "#32CD32",
    "Linen": "#FAF0E6",
    "Magenta": "#FF00FF",
    "Maroon": "#800000",
    "MediumAquaMarine": "#66CDAA",
    "MediumBlue": "#0000CD",
    "MediumOrchid": "#BA55D3",
    "MediumPurple": "#9370D8",
    "MediumSeaGreen": "#3CB371",
    "MediumSlateBlue": "#7B68EE",
    "MediumSpringGreen": "#00FA9A",
    "MediumTurquoise": "#48D1CC",
    "MediumVioletRed": "#C71585",
    "MidnightBlue": "#191970",
    "MintCream": "#F5FFFA",
    "MistyRose": "#FFE4E1",
    "Moccasin": "#FFE4B5",
    "NavajoWhite": "#FFDEAD",
    "Navy": "#000080",
    "OldLace": "#FDF5E6",
    "Olive": "#808000",
    "OliveDrab": "#6B8E23",
    "Orange": "#FFA500",
    "OrangeRed": "#FF4500",
    "Orchid": "#DA70D6",
    "PaleGoldenRod": "#EEE8AA",
    "PaleGreen": "#98FB98",
    "PaleTurquoise": "#AFEEEE",
    "PaleVioletRed": "#D87093",
    "PapayaWhip": "#FFEFD5",
    "PeachPuff": "#FFDAB9",
    "Peru": "#CD853F",
    "Pink": "#FFC0CB",
    "Plum": "#DDA0DD",
    "PowderBlue": "#B0E0E6",
    "Purple": "#800080",
    "Red": "#FF0000",
    "RosyBrown": "#BC8F8F",
    "RoyalBlue": "#4169E1",
    "SaddleBrown": "#8B4513",
    "Salmon": "#FA8072",
    "SandyBrown": "#F4A460",
    "SeaGreen": "#2E8B57",
    "SeaShell": "#FFF5EE",
    "Sienna": "#A0522D",
    "Silver": "#C0C0C0",
    "SkyBlue": "#87CEEB",
    "SlateBlue": "#6A5ACD",
    "SlateGray": "#708090",
    "SlateGrey": "#708090",
    "Snow": "#FFFAFA",
    "SpringGreen": "#00FF7F",
    "SteelBlue": "#4682B4",
    "Tan": "#D2B48C",
    "Teal": "#008080",
    "Thistle": "#D8BFD8",
    "Tomato": "#FF6347",
    "Turquoise": "#40E0D0",
    "Violet": "#EE82EE",
    "Wheat": "#F5DEB3",
    "White": "#FFFFFF",
    "WhiteSmoke": "#F5F5F5",
    "Yellow": "#FFFF00",
    "YellowGreen": "#9ACD32" 
};

/**
 * Checks if a color is a RGB color.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a RGB color, false otherwise.
 */
Color.isRGB = function( color ) {
    return /^(rgb\()?(\d{1,3},\d{1,3},\d{1,3})|(\d{1,3}%,\d{1,3}%,\d{1,3}%)\)?$/i.test( color );
}

/**
 * Checks if a color is a RGBA color.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a RGBA color, false otherwise.
 */
Color.isRGBA = function( color ) {
    return /^(rgba\()?(((\d{1,3},){3})|((\d{1,3}%,){3}))(1|0?(\.\d{1,2})?)\)?$/i.test( color );
}

/**
 * Checks if a color is a HSL color.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a HSL color, false otherwise.
 */
Color.isHSL = function( color ) {
    return /^(hsl\()?\d{1,3},\d{1,3}%,\d{1,3}%\)?$/i.test( color );
}

/**
 * Checks if a color is a HSLA color.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a HSLA color, false otherwise.
 */
Color.isHSLA = function( color ) {
    return /^(hsla\()?\d{1,3},\d{1,3}%,\d{1,3}%,(1|(0?\.\d{1,2}))\)?$/i.test( color );
}

/**
 * Checks if a color is a Hexadecimal color. The color can be in short hex or regular format.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a Hex color, false otherwise.
 */
Color.isHex = function( color ) {
    return /^#[\da-f]{3}|[\da-f]{6}$/i.test( color );
}

/**
 * Checks if a color is a Hexadecimal color with alpa channel (used in css filters for Internet Explorer).
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a Hex color with alpha channel, false otherwise.
 */
Color.isHexa = function( color ) {
    return /^#[\da-f]{8}$/i.test( color );
}

/**
 * Checks if a color is an existing color name.
 * @param        {String}    color        The color in string format.
 * @returns    True if the color is a valid color name, false otherwise.
 */
Color.isColor = function( color ) {
    if ( Color.findColor( color ) !== false ) return true;
    else return false;
}

/**
 * Returns the hexadecimal equivalent of a color name. If the name doesn't exist this function will return false.
 * @param        {String}    color        The color name.
 * @returns    The hexadecimal equivalent of the color name if available, false otherwise.
 */
Color.findColor = function( color ) {
    for ( key in Color.names ) {
        if ( color.toLowerCase() == key.toLowerCase() ) {
            return Color.names[key];
        }
    }
    return false;
}

/**
 * Extracts a RGB or RGBA color value to an object with individual values.
 * If the values are in percentages the colors will be converted to integers.
 * @param        {String}    rgb        The RGB or RGBA color value in string format.
 * @returns    Returns an object with the 'r', 'g', 'b' and optionally 'a' values of the input.
 */
Color.extractRGB = function( rgb ) {
    rgb = rgb.replace( "rgb(", "" );
    rgb = rgb.replace( "rgba(", "" );
    rgb = rgb.replace( ")", "" );
    rgb = rgb.split( "," );

    r = ( rgb[0].search( "%" ) != -1 ) ? Math.round( ( parseInt( rgb[0] ) / 100 ) * 255 ) : parseInt( rgb[0] );
    g = ( rgb[1].search( "%" ) != -1 ) ? Math.round( ( parseInt( rgb[1] ) / 100 ) * 255 ) : parseInt( rgb[1] );
    b = ( rgb[2].search( "%" ) != -1 ) ? Math.round( ( parseInt( rgb[2] ) / 100 ) * 255 ) : parseInt( rgb[2] );
    
    if ( rgb.length == 3 ) {
        return { r: r, g: g, b: b }
    } else if ( rgb.length == 4 ) {
        return { r: r, g: g, b: b, a: parseFloat( rgb[3] ) }
    }
}

/**
 * This function is an alias of: Color.extractRGB.
 */
Color.extractRGBA = function( rgba ) {
    return Color.extractRGB( rgba );
}

/**
 * Extracts a HSL or HSLA color value to an object with individual values.
 * @param        {String}    hsl        The HSL or HSLA color value in string format.
 * @returns    Returns an object with the 'h', 's', 'l' and optionally 'a' values of the input.
 */
Color.extractHSL = function( hsl ) {
    hsl = hsl.replace( "hsl(", "" );
    hsl = hsl.replace( "hsla(", "" );
    hsl = hsl.replace( ")", "" );
    hsl = hsl.split( "," );

    h = parseInt( hsl[0] );
    s = parseInt( hsl[1] );
    l = parseInt( hsl[2] );
    
    if ( hsl.length == 3 ) {
        return { h: h, s: s, l: l }
    } else if ( hsl.length == 4 ) {
        return { h: h, s: s, l: l, a: parseFloat( hsl[3] ) }
    }
}

/**
 * This function is an alias of: Color.extractHSL.
 */
Color.extractHSLA = function( hsla ) {
    return Color.extractHSL( hsla );
}

/**
 * Formats a hexadecimal value to six digits with uppercased characters. If the input is in short hex 
 * the output will be extended to six digits and if the input is in hex with added alpha channel the alpha
 * channel will be removed. The output is prefixed with a hash.
 * @param        {String}    hex        A hexadecimal color value.
 * @returns    Returns an uppercased hex value of six digits prefixed with a hash.
 */
Color.formatHex = function( hex ) {
    hex = hex.replace( "#", "" ).toUpperCase();
    if ( hex.length == 6 ) {
        return "#" + hex;
    } else if ( hex.length == 3 ) {
        return "#" + hex.charAt( 0 ).repeat( 2 ) + hex.charAt( 1 ).repeat( 2 ) + hex.charAt( 2 ).repeat( 2 );
    } else if ( hex.length == 8 ) {
        return "#" + hex.substr( 2 );
    }
}

/**
 * This function is an alias of: Color.findColor.
 */
Color.ColorToHex = function( color ) {
    return Color.findColor( color );
}

/**
 * This function converts a hexadecimal value to it's RGB equivalent. The input must be in regular hex: #RRGGBB
 * @param        {String}    hex        A hexadecimal color value in regular hex: #RRGGBB
 * @returns    Returns an object with the 'r', 'g' and 'b' values.
 */
Color.HexToRGB = function( hex ) {
    hex = hex.replace( "#", "" );

    var r = parseInt( hex.substr( 0, 2 ), 16 );
    var g = parseInt( hex.substr( 2, 2 ), 16 );
    var b = parseInt( hex.substr( 4, 2 ), 16 );

    return { r: r, g: g, b: b };
}

/**
 * This function converts a RGB value to it's hexadecimal equivalent. The input can be a string or a RGB color object
 * @param        {String}    rgb        A RGB color value or object.
 * @returns    Returns an uppercased hex value of six digits prefixed with a hash.
 */
Color.RGBToHex = function( rgb ) {
    if ( typeof rgb != "object" ) rgb = Color.extractRGB( rgb );
    
    var hex = [
        rgb.r.toString( 16 ).padLeft( 2, "0" ),
        rgb.g.toString( 16 ).padLeft( 2, "0" ),
        rgb.b.toString( 16 ).padLeft( 2, "0" )
    ];

    return "#" + hex.join( "" ).toUpperCase();
}

/**
 * This function converts a HSL value to it's RGB equivalent. The input can be a string or a HSL color object
 * @param        {String}    hsl        A HSL color value or object.
 * @returns    Returns an object with the 'r', 'g' and 'b' values.
 */
Color.HSLToRGB = function( hsl ) {
    if ( typeof hsl != "object" ) hsl = Color.extractHSL( hsl );

    H = hsl.h / 360;
    S = hsl.s / 100;
    L = hsl.l / 100;

    if ( S == 0 ){
        R = L * 255;
        G = L * 255;
        B = L * 255;
    }else{
        var_2 = (L < 0.5)? (L * ( 1 + S )) : (( L + S ) - ( S * L ));
        var_1 = 2 * L - var_2;
        R = Color.HueToRGB( var_1, var_2, H + ( 1 / 3 ) ) ;
        G = Color.HueToRGB( var_1, var_2, H );
        B = Color.HueToRGB( var_1, var_2, H - ( 1 / 3 ) );
    }

    return { r: Math.round( R ), g: Math.round( G ), b: Math.round( B ) };
}

/**
 * Converts a hue value to an integer representing a color in RGB
 */
Color.HueToRGB = function( v1, v2, vH ) {
    if ( vH < 0 ) vH += 1;
    if ( vH > 1 ) vH -= 1;
    if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
    if ( ( 2 * vH ) < 1 ) return ( v2 );
    if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
    return ( v1 * 255 );
}

/**
 * This function converts a RGB value to it's HSL equivalent. The input can be a string or a HSL color object
 * @param        {String}    rgb        A RGB color value or object.
 * @returns    Returns an object with the 'h', 's' and 'l' values.
 */
Color.RGBToHSL = function( rgb ) {
    if ( typeof rgb != "object" ) rgb = Color.extractRGB( rgb );
     
    r = ( rgb.r / 255 ); // RGB from 0 to 255
    g = ( rgb.g / 255 );
    b = ( rgb.b / 255 );

    min = Math.min( r, g, b ); // min. value of RGB
    max = Math.max( r, g, b ); // max. value of RGB
    delta_max = max - min; // delta RGB value

    l = ( max + min ) / 2;

    // if it's gray
    if ( delta_max == 0 ) { 
         h = 0; // HSL results from 0 to 1
         s = 0;

    // chromatic data
    }    else { 
         if ( l < 0.5 ) s = delta_max / ( max + min );
         else s = delta_max / ( 2 - max - min );

         delta_r = ( ( ( max - r ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
         delta_g = ( ( ( max - g ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
         delta_b = ( ( ( max - b ) / 6 ) + ( delta_max / 2 ) ) / delta_max;

         if ( r == max ) h = delta_b - delta_g;
         else if ( g == max ) h = ( 1 / 3 ) + delta_r - delta_b;
         else if ( b == max ) h = ( 2 / 3 ) + delta_g - delta_r;

         if ( h < 0 ) h += 1;
         if ( h > 1 ) h -= 1;
    }
    return { h: Math.round( h * 360 ), s: Math.round( s * 100 ), l: Math.round( l * 100 ) };
}

/**
 * This function converts a hexadecimal color to it's equivalent name if available.
 * @param        {String}    hex        A hexadecimal value in regular format: #RRGGBB
 * @returns    A color name if available, otherwise an empty string will be returned
 */
Color.HexToColor = function( hex ) {
    for ( key in Color.names ) {
        if ( hex.toUpperCase() == Color.names[key] ) return key;
    }
    return "";
}

/**
 * This function converts an opacity value to it's hexadecimal equivalent.
 * @param        {Number}    opacity    An opacity value in float.
 * @returns    The hexadecimal equivalent of the opacity.
 */
Color.opacityToHex = function( opacity ) {
    return Math.round( opacity * 255 ).toString( 16 ).padLeft( 2, "0" ).toUpperCase();
}

/**
 * This function converts a hexadecimal opacity value to it's float equivalent.
 * @param        {Number}    opacity    A hexadecimal opacity value in: AA.
 * @returns    The float opacity equivalent of the hexadecimal opacity.
 */
Color.hexToOpacity = function( opacity ) {
    return parseInt( opacity, 16 ) / 255;
}