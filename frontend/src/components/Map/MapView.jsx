import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Box,
    FormControl,
    MenuItem,
    Select
} from "@mui/material";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { initializeLayers } from "./MapManager";
import { loadWeatherIcons } from "./IconManager";


const OPENFREE_STYLE =
    "https://tiles.openfreemap.org/styles/liberty";


const OSM_STYLE = {

    version: 8,

    sources: {

        osm: {

            type: "raster",

            tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],

            tileSize: 256,

            maxzoom: 19,

            attribution:
                "© OpenStreetMap contributors"
        }

    },

    layers: [

        {
            id: "osm-basemap",

            type: "raster",

            source: "osm"
        }

    ]
};


export default function MapView({
    viewMode,
    timeWindow,
    selectedEvents,
    selectedSources
}) {

    const mapRef =
        useRef(null);

    const mapInstance =
        useRef(null);

    const mapLoaded =
        useRef(false);

    /*
     * Used so an older request cannot hide
     * Loading... while a newer request is
     * still running.
     */
    const loadSequence =
        useRef(0);


    const [baseMap, setBaseMap] =
        useState("standard");

    const [loading, setLoading] =
        useState(false);


    // --------------------------------------------------
    // LOAD SMRITI OVERLAYS
    // --------------------------------------------------

    async function loadSmritiLayers(
        map
    ) {

        await loadWeatherIcons(
            map
        );

        await initializeLayers(

            map,

            viewMode,

            timeWindow,

            selectedEvents,

            selectedSources

        );

    }


    // --------------------------------------------------
    // CREATE MAP
    // --------------------------------------------------

    useEffect(() => {

        if (
            mapInstance.current
        ) {

            return;

        }


        console.log(
            "1. Creating map"
        );


        const map =
            new maplibregl.Map({

                container:
                    mapRef.current,

                style:
                    OPENFREE_STYLE,

                center: [
                    78.9629,
                    22.5937
                ],

                zoom: 4.5

            });


        map.addControl(

            new maplibregl
                .NavigationControl(),

            "top-left"

        );


        // ----------------------------------------------
        // INITIAL MAP LOAD
        // ----------------------------------------------

        map.on(
            "load",

            async () => {

                console.log(
                    "2. Map loaded"
                );


                setLoading(true);


                try {

                    await loadSmritiLayers(
                        map
                    );

                    mapLoaded.current =
                        true;


                    console.log(
                        "3. SMRITI layers loaded"
                    );

                }
                catch (error) {

                    console.error(
                        "Map initialization failed:",
                        error
                    );

                }
                finally {

                    setLoading(false);

                }

            }
        );


        mapInstance.current =
            map;


        // ----------------------------------------------
        // CLEANUP
        // ----------------------------------------------

        return () => {

            mapLoaded.current =
                false;

            if (
                mapInstance.current
            ) {

                mapInstance.current
                    .remove();

                mapInstance.current =
                    null;

            }

        };


    }, []);


    // --------------------------------------------------
    // CHANGE BASEMAP
    // --------------------------------------------------

    useEffect(() => {

        const map =
            mapInstance.current;


        if (!map) {

            return;

        }


        /*
         * Standard is already loaded when the map
         * is first created.
         */
        if (
            baseMap === "standard" &&
            !mapLoaded.current
        ) {

            return;

        }


        async function changeBaseMap() {

            const sequence =
                ++loadSequence.current;

            setLoading(true);

            mapLoaded.current =
                false;


            try {

                let style;


                if (
                    baseMap === "standard"
                ) {

                    style =
                        OPENFREE_STYLE;

                }
                else if (
                    baseMap === "osm"
                ) {

                    style =
                        OSM_STYLE;

                }
                else {

                    return;

                }


                /*
                 * Changing style removes our custom
                 * SMRITI sources/layers/images.
                 */
                map.setStyle(
                    style
                );


                map.once(
                    "style.load",

                    async () => {

                        try {

                            await loadSmritiLayers(
                                map
                            );

                            mapLoaded.current =
                                true;


                            console.log(
                                "Basemap changed:",
                                baseMap
                            );

                        }
                        catch (error) {

                            console.error(
                                "Unable to reload SMRITI layers:",
                                error
                            );

                        }
                        finally {

                            if (
                                sequence ===
                                loadSequence.current
                            ) {

                                setLoading(false);

                            }

                        }

                    }

                );

            }
            catch (error) {

                console.error(
                    "Unable to change basemap:",
                    error
                );


                if (
                    sequence ===
                    loadSequence.current
                ) {

                    setLoading(false);

                }

            }

        }


        changeBaseMap();


    }, [baseMap]);


    // --------------------------------------------------
    // UPDATE MAP WHEN FILTERS / TIMELINE CHANGE
    // --------------------------------------------------

    useEffect(() => {

        if (
            !mapInstance.current
        ) {

            return;

        }


        if (
            !mapLoaded.current
        ) {

            return;

        }


        const sequence =
            ++loadSequence.current;


        setLoading(true);


        console.log(
            "Updating map..."
        );


        initializeLayers(

            mapInstance.current,

            viewMode,

            timeWindow,

            selectedEvents,

            selectedSources

        )
        .then(() => {

            console.log(
                "Map update complete."
            );

        })
        .catch((error) => {

            console.error(
                "Map update failed:",
                error
            );

        })
        .finally(() => {

            if (
                sequence ===
                loadSequence.current
            ) {

                setLoading(false);

            }

        });


    }, [

        viewMode,

        timeWindow,

        selectedEvents,

        selectedSources

    ]);


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "relative"
            }}
        >

            {/* MAP */}

            <div
                ref={mapRef}

                style={{
                    width: "100%",
                    height: "100%"
                }}
            />


            {/* ------------------------------------------
                LOADING INDICATOR
            ------------------------------------------ */}

{loading && (

    <Box
        sx={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            zIndex: 50,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            bgcolor:
                "rgba(255,255,255,0.65)",

            cursor: "wait",

            /*
             * Important:
             * this captures mouse events so the
             * user cannot click, pan or zoom the
             * map while data is being refreshed.
             */
            pointerEvents: "auto"
        }}
    >

        <Box
            sx={{
                px: 3,
                py: 1.25,

                bgcolor:
                    "rgba(255,255,255,0.98)",

                borderRadius: 1,

                boxShadow: 3,

                fontWeight: 700,

                fontSize: "1rem"
            }}
        >
            Loading...
        </Box>

    </Box>

)}

            {/* ------------------------------------------
                BASEMAP SELECTOR
            ------------------------------------------ */}

            <Box
                sx={{
                    position: "absolute",

                    top: 10,
                    right: 10,

                    zIndex: 20,

                    bgcolor:
                        "#ffffff",

                    borderRadius: 1,

                    boxShadow: 2,

                    p: 0.5
                }}
            >

                <FormControl
                    size="small"

                    sx={{
                        minWidth: 165
                    }}
                >

                    <Select
                        value={baseMap}

                        onChange={
                            (event) =>
                                setBaseMap(
                                    event.target.value
                                )
                        }
                    >

                        <MenuItem
                            value="standard"
                        >
                            Standard Map
                        </MenuItem>


                        <MenuItem
                            value="osm"
                        >
                            OpenStreetMap
                        </MenuItem>

                    </Select>

                </FormControl>

            </Box>

        </Box>

    );

}
