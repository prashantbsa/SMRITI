import { useEffect, useRef } from "react";
import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { initializeLayers } from "./MapManager";

export default function MapView() {

    const container = useRef(null);

    useEffect(() => {

        console.log("1. Creating map");

        const map = new Map({

            container: container.current,

            style: "https://tiles.openfreemap.org/styles/liberty",

            center: [78.9629, 22.5937],

            zoom: 4.5

        });

        // Expose map for debugging
        window.map = map;

        map.addControl(
            new NavigationControl(),
            "top-left"
        );

        map.on("load", () => {

            console.log("2. Map loaded");

            initializeLayers(map);

            console.log("3. initializeLayers finished");

        });

        return () => map.remove();

    }, []);

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
