import rainIcon from "../../assets/weather-icons/rain.svg";
import lightningIcon from "../../assets/weather-icons/lightning.svg";
import snowIcon from "../../assets/weather-icons/snow.svg";
import hailIcon from "../../assets/weather-icons/hail.svg";
import fogIcon from "../../assets/weather-icons/fog.svg";

async function loadSvg(url) {
    const response = await fetch(url);
    const svgText = await response.text();

    const img = new Image();

    return new Promise((resolve) => {

        img.onload = () => resolve(img);

        img.src =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(svgText);

    });
}

export async function loadWeatherIcons(map) {

    const icons = {

        RAIN: rainIcon,

        LIGHTNING: lightningIcon,

        SNOW: snowIcon,

        HAIL: hailIcon,

        FOG: fogIcon

    };

    for (const [name, file] of Object.entries(icons)) {

        if (map.hasImage(name))
            continue;

        const image = await loadSvg(file);

        map.addImage(name, image);

    }

}
