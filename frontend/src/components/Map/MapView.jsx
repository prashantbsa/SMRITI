import { useEffect, useRef } from "react";
import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { initializeLayers } from "./MapManager";

export default function MapView({ viewMode, timeWindow }) {

    console.log("Current View:", viewMode);
    console.log("Current Time Window:", timeWindow);

    const container = useRef(null);

    useEffect(() => {

        console.log("Creating map...");

        const map = new Map({

            container: container.current,

            style: "https://tiles.openfreemap.org/styles/liberty",

            center: [78.9629, 22.5937],

            zoom: 4.5,

            interactive: true,

        });

        window.map = map;

        map.addControl(

            new NavigationControl(),

            "top-left"

        );

        map.on("style.load", () => {

            console.log("Style loaded");

            initializeLayers(

                map,

                viewMode,

                timeWindow

            );

            console.log("Layers initialized");

        });

        return () => {

            map.remove();

        };

    }, [viewMode, timeWindow]);

    return (

        <div

            ref={container}

            style={{

                width: "100%",

                height: "100%"

            }}

        />

    );

}
