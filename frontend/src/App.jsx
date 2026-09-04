import {
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import MainLayout from "./layouts/MainLayout";
import LoginPage from "./components/Login/LoginPage";

import {
    getCurrentUser,
    logout
} from "./services/authService";


function App() {

    const [user, setUser] =
        useState(null);

    const [checkingSession, setCheckingSession] =
        useState(true);


    useEffect(() => {

        let active = true;

        async function checkSession() {

            try {

                const result =
                    await getCurrentUser();

                if (active) {
                    setUser(result.user);
                }

            } catch {

                if (active) {
                    setUser(null);
                }

            } finally {

                if (active) {
                    setCheckingSession(false);
                }
            }
        }

        checkSession();

        return () => {
            active = false;
        };

    }, []);


    const handleLogout = async () => {

        try {
            await logout();
        } catch {
            // Even if the server session was already
            // replaced/revoked, remove local UI access.
        } finally {
            setUser(null);
        }
    };


    if (checkingSession) {

        return (

            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading SMRITI...
                </Typography>

            </Box>
        );
    }


    if (!user) {

        return (
            <LoginPage
                onLogin={setUser}
            />
        );
    }


    return (
        <MainLayout
            currentUser={user}
            onLogout={handleLogout}
        />
    );
}


export default App;
