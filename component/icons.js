export const getIcon = icon => {
    switch (icon) {
        case "01d":
            return require("../icons/01d.png");
        case "01n":
            return require("../icons/01n.png");
        case "02d":
            return require("../icons/02d.png");
        case "02n":
            return require("../icons/02n.png");
        case "03d":
            return require("../icons/03d.png");
        case "03n":
            return require("../icons/03n.png");
        case "04d":
            return require("../icons/04d.png");
        case "04n":
            return require("../icons/04n.png");
        case "09d":
            return require("../icons/09d.png");
        case "09n":
            return require("../icons/09n.png");
        case "10d":
            return require("../icons/10d.png");
        case "10n":
            return require("../icons/10n.png");
        case "11d":
            return require("../icons/11d.png");
        case "11n":
            return require("../icons/11n.png");
        case "13d":
            return require("../icons/13d.png");
        case "13n":
            return require("../icons/13n.png");
        case "50d":
            return require("../icons/50d.png");
        case "50n":
            return require("../icons/50n.png");
        case "humidity":
            return require("../icons/humidity.png");
        case "pressure":
            return require("../icons/pressure.png");
        case "wind_deg":
            return require("../icons/wind_deg.png");
        case "wind_speed":
            return require("../icons/wind_speed.png");
        case "visibility":
            return require("../icons/visibility.png");
        case "feels_like":
            return require("../icons/feels_like.png");
        default:
            {
                console.log("ERROR:", icon);
                return require("../icons/error.png");
            }

    }
}