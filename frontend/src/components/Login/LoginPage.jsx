import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import { useState } from "react";

import {
    login
} from "../../services/authService";


export default function LoginPage({
    onLogin
}) {

    const [showLogin, setShowLogin] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setLoading(true);

        try {

            const result = await login(
                email.trim(),
                password
            );

            onLogin(result.user);

        } catch (err) {

            if (err.status === 401) {
                setError(
                    "Invalid email or password."
                );
            } else {
                setError(
                    "Unable to connect to SMRITI. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f7f9",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #dfe5e8",
                    px: {
                        xs: 2,
                        md: 5
                    },
                    py: 2
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    SMRITI
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Smart Meteorological Reporting
                    &amp; Information Tracking Initiative
                </Typography>

            </Box>


            {/* PUBLIC LANDING AREA */}

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2,
                    py: 5
                }}
            >

                {!showLogin ? (

                    <Paper
                        elevation={1}
                        sx={{
                            width: "100%",
                            maxWidth: 760,
                            p: {
                                xs: 3,
                                md: 6
                            },
                            textAlign: "center",
                            borderRadius: 2
                        }}
                    >

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 2
                            }}
                        >
                            Welcome to SMRITI
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontWeight: 400,
                                mb: 4
                            }}
                        >
                            Smart Meteorological Reporting
                            &amp; Information Tracking Initiative
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                maxWidth: 600,
                                mx: "auto",
                                mb: 4
                            }}
                        >
                            A platform for viewing and
                            analysing crowdsourced weather
                            observations and weather events.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() =>
                                setShowLogin(true)
                            }
                            sx={{
                                minWidth: 150
                            }}
                        >
                            Login
                        </Button>

                    </Paper>

                ) : (

                    <Paper
                        elevation={2}
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: "100%",
                            maxWidth: 420,
                            p: {
                                xs: 3,
                                md: 4
                            },
                            borderRadius: 2
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                mb: 0.5
                            }}
                        >
                            Login to SMRITI
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 3
                            }}
                        >
                            Enter your portal credentials
                            to access the dashboard.
                        </Typography>


                        {error && (

                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2
                                }}
                            >
                                {error}
                            </Alert>

                        )}


                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                            fullWidth
                            autoComplete="username"
                            disabled={loading}
                            sx={{
                                mb: 2
                            }}
                        />


                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                            fullWidth
                            autoComplete="current-password"
                            disabled={loading}
                            sx={{
                                mb: 3
                            }}
                        />


                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            sx={{
                                minHeight: 44
                            }}
                        >

                            {loading ? (
                                <CircularProgress
                                    size={22}
                                />
                            ) : (
                                "Login"
                            )}

                        </Button>


                        <Button
                            type="button"
                            variant="text"
                            fullWidth
                            disabled={loading}
                            onClick={() => {
                                setShowLogin(false);
                                setError("");
                                setPassword("");
                            }}
                            sx={{
                                mt: 1
                            }}
                        >
                            Back
                        </Button>

                    </Paper>

                )}

            </Box>


            {/* PLACEHOLDER FOR FUTURE PUBLIC CONTENT */}

            <Box
                sx={{
                    textAlign: "center",
                    px: 2,
                    py: 2,
                    borderTop: "1px solid #dfe5e8",
                    backgroundColor: "#ffffff"
                }}
            >

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Smart Meteorological Reporting
                    &amp; Information Tracking Initiative
                </Typography>

            </Box>

        </Box>
    );
}
