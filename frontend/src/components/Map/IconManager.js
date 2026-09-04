import rainIcon from "../../assets/weather-icons/rain.svg";
import lightningIcon from "../../assets/weather-icons/lightning.svg";
import snowIcon from "../../assets/weather-icons/snow.svg";
import hailIcon from "../../assets/weather-icons/hail.svg";
import fogIcon from "../../assets/weather-icons/fog.svg";
import drizzleIcon from "../../assets/weather-icons/drizzle.svg";
import hotHumidIcon from "../../assets/weather-icons/hot_humid.svg";

import thunderIcon from "../../assets/weather-icons/thunder.svg";

import thunderLightningIcon from "../../assets/weather-icons/thunder_lightning.svg";

import dustStormIcon from "../../assets/weather-icons/dust_storm.svg";

import gustyWindIcon from "../../assets/weather-icons/gusty_wind.svg";

import cycloneIcon from "../../assets/weather-icons/cyclone.svg";


// --------------------------------------------------
// Load SVG image
// --------------------------------------------------

function loadSvg(url) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => {

            resolve(img);

        };

        img.onerror = () => {

            reject(
                new Error(
                    `Unable to decode weather icon: ${url}`
                )
            );

        };

        /*
         * Vite gives us the final asset URL.
         *
         * Do NOT fetch the SVG and convert it into
         * another data URI. Let the browser decode
         * the SVG directly.
         */

        img.src = url;

    });

}


function createDefaultDot() {

    const size = 32;

    const canvas =
        document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;

    const context =
        canvas.getContext("2d");

    context.clearRect(
        0,
        0,
        size,
        size
    );

    context.beginPath();

    context.arc(
        size / 2,
        size / 2,
        6,
        0,
        Math.PI * 2
    );

    context.fillStyle =
        "#616161";

    context.fill();

    /*
     * MapLibre accepts ImageData reliably.
     */
    return context.getImageData(
        0,
        0,
        size,
        size
    );
}

// --------------------------------------------------
// Load all weather icons
// --------------------------------------------------

export async function loadWeatherIcons(map) {

const icons = {

    RAIN:
        rainIcon,

    DRIZZLE:
        drizzleIcon,

    THUNDER:
        thunderIcon,

    LIGHTNING:
        lightningIcon,

    THUNDER_LIGHTNING:
        thunderLightningIcon,

    SNOW:
        snowIcon,

    HAIL:
        hailIcon,

    FOG:
        fogIcon,

    HOT_HUMID:
        hotHumidIcon,

    DUST_STORM:
        dustStormIcon,

    GUSTY_WIND:
        gustyWindIcon,

    CYCLONE:
        cycloneIcon

};


if (!map.hasImage("DEFAULT_DOT")) {

    map.addImage(
        "DEFAULT_DOT",
        createDefaultDot(),
        {
            pixelRatio: 1
        }
    );

}


    for (const [name, file] of Object.entries(icons)) {

        try {

            /*
             * Already loaded?
             */

            if (map.hasImage(name)) {

                continue;

            }


            const image = await loadSvg(file);


            /*
             * MapLibre requires an image object.
             */

            map.addImage(

                name,

                image,

                {
                    pixelRatio: 1
                }

            );


            console.log(
                `Weather icon loaded: ${name}`
            );

        }
        catch (error) {

            console.error(
                `Failed to load weather icon: ${name}`,
                error
            );

        }

    }

}
