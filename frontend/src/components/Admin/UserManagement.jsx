import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import {
    createPortalUser,
    getPortalUsers,
    resetPortalUserPassword
} from "../../services/authService";


const EMPTY_FORM = {
    name: "",
    email: "",
    contactNo: "",
    office: "",
    password: ""
};


export default function UserManagement({
    onClose
}) {

    const [form, setForm] =
        useState(EMPTY_FORM);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [usersLoading, setUsersLoading] =
        useState(true);

    const [usersError, setUsersError] =
        useState("");

    const [resetUser, setResetUser] =
        useState(null);

    const [resetPassword, setResetPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [resetLoading, setResetLoading] =
        useState(false);

    const [resetError, setResetError] =
        useState("");


    const loadUsers = async () => {

        setUsersLoading(true);
        setUsersError("");

        try {

            const result =
                await getPortalUsers();

            setUsers(
                Array.isArray(result?.users)
                    ? result.users
                    : []
            );

        } catch (err) {

            if (err.status === 401) {

                setUsersError(
                    "Your login session is no longer valid."
                );

            } else if (err.status === 403) {

                setUsersError(
                    "Administrator access is required."
                );

            } else {

                setUsersError(
                    err.message ||
                    "Unable to load portal users."
                );
            }

        } finally {

            setUsersLoading(false);
        }
    };


    useEffect(() => {

        loadUsers();

    }, []);


    const updateField = (
        field,
        value
    ) => {

        setForm((current) => ({
            ...current,
            [field]: value
        }));

        setError("");
        setSuccess("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const result =
                await createPortalUser({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    contactNo:
                        form.contactNo.trim(),
                    office: form.office.trim(),
                    password: form.password
                });

            setSuccess(
                `User ${result.user.name} created successfully.`
            );

            setForm(EMPTY_FORM);

            await loadUsers();

        } catch (err) {

            if (err.status === 409) {

                setError(
                    "A user with this email already exists."
                );

            } else if (err.status === 401) {

                setError(
                    "Your login session is no longer valid."
                );

            } else if (err.status === 403) {

                setError(
                    "Administrator access is required."
                );

            } else {

                setError(
                    err.message ||
                    "Unable to create user."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    const openResetDialog = (user) => {

        setResetUser(user);
        setResetPassword("");
        setConfirmPassword("");
        setResetError("");
    };


    const closeResetDialog = () => {

        if (resetLoading) {
            return;
        }

        setResetUser(null);
        setResetPassword("");
        setConfirmPassword("");
        setResetError("");
    };


    const handleResetPassword = async () => {

        if (!resetUser || resetLoading) {
            return;
        }

        setResetError("");

        if (resetPassword.length < 8) {

            setResetError(
                "Password must contain at least 8 characters."
            );

            return;
        }

        if (resetPassword !== confirmPassword) {

            setResetError(
                "New password and confirmation do not match."
            );

            return;
        }

        setResetLoading(true);

        try {

            await resetPortalUserPassword(
                resetUser.id,
                resetPassword
            );

            const userName = resetUser.name;

            closeResetDialog();

            setSuccess(
                `Password for ${userName} reset successfully. The user's existing login session has been revoked.`
            );

            setError("");

        } catch (err) {

            if (err.status === 401) {

                setResetError(
                    "Your login session is no longer valid."
                );

            } else if (err.status === 403) {

                setResetError(
                    "This password cannot be reset through User Management."
                );

            } else if (err.status === 404) {

                setResetError(
                    "Portal user was not found."
                );

            } else {

                setResetError(
                    err.message ||
                    "Unable to reset password."
                );
            }

        } finally {

            setResetLoading(false);
        }
    };


    return (

        <Box
            sx={{
                height: "100%",
                overflow: "auto",
                backgroundColor: "#f4f7f9",
                p: {
                    xs: 2,
                    md: 4
                },
                boxSizing: "border-box"
            }}
        >

            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 2,
                        mb: 3
                    }}
                >

                    <Box>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700
                            }}
                        >
                            User Management
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage access to the
                            SMRITI portal.
                        </Typography>

                    </Box>

                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Back to Dashboard
                    </Button>

                </Box>


                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    elevation={1}
                    sx={{
                        p: {
                            xs: 3,
                            md: 4
                        },
                        borderRadius: 2,
                        mb: 3
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontWeight: 600
                        }}
                    >
                        Create User
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


                    {success && (

                        <Alert
                            severity="success"
                            sx={{
                                mb: 2
                            }}
                        >
                            {success}
                        </Alert>

                    )}


                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                        disabled={loading}
                        inputProps={{
                            maxLength: 150
                        }}
                        sx={{
                            mb: 2
                        }}
                    />


                    <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            updateField(
                                "email",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                        disabled={loading}
                        inputProps={{
                            maxLength: 254
                        }}
                        sx={{
                            mb: 2
                        }}
                    />


                    <TextField
                        label="Contact No."
                        value={form.contactNo}
                        onChange={(event) =>
                            updateField(
                                "contactNo",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                        disabled={loading}
                        inputProps={{
                            maxLength: 30
                        }}
                        sx={{
                            mb: 2
                        }}
                    />


                    <TextField
                        label="Office"
                        value={form.office}
                        onChange={(event) =>
                            updateField(
                                "office",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                        disabled={loading}
                        inputProps={{
                            maxLength: 200
                        }}
                        sx={{
                            mb: 2
                        }}
                    />


                    <TextField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(event) =>
                            updateField(
                                "password",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                        disabled={loading}
                        helperText={
                            "Minimum 8 characters."
                        }
                        inputProps={{
                            minLength: 8
                        }}
                        sx={{
                            mb: 3
                        }}
                    />


                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            minWidth: 150,
                            minHeight: 42
                        }}
                    >

                        {loading ? (
                            <CircularProgress
                                size={22}
                            />
                        ) : (
                            "Create User"
                        )}

                    </Button>

                </Paper>


                <Paper
                    elevation={1}
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        mb: 3
                    }}
                >

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                md: 3
                            }
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            Users Having Portal Access
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Administrator and normal
                            user accounts currently
                            configured for SMRITI.
                        </Typography>

                    </Box>

                    <Divider />


                    {usersError && (

                        <Alert
                            severity="error"
                            sx={{
                                m: 2
                            }}
                        >
                            {usersError}
                        </Alert>

                    )}


                    {usersLoading ? (

                        <Box
                            sx={{
                                py: 5,
                                display: "flex",
                                justifyContent:
                                    "center"
                            }}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                        <TableContainer>

                            <Table
                                size="small"
                                aria-label={
                                    "Portal users"
                                }
                            >

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Name
                                        </TableCell>

                                        <TableCell>
                                            Email
                                        </TableCell>

                                        <TableCell>
                                            Contact No.
                                        </TableCell>

                                        <TableCell>
                                            Office
                                        </TableCell>

                                        <TableCell>
                                            Role
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >
                                            Action
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {users.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                colSpan={6}
                                                align="center"
                                                sx={{
                                                    py: 4
                                                }}
                                            >
                                                No portal
                                                users found.
                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        users.map(
                                            (user) => (

                                                <TableRow
                                                    key={
                                                        user.id
                                                    }
                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            user.name
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            user.email
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            user.contact_no
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            user.office
                                                        }
                                                    </TableCell>

                                                    <TableCell>

                                                        <Chip
                                                            label={
                                                                user.role
                                                            }
                                                            size="small"
                                                            variant={
                                                                user.role ===
                                                                "ADMIN"
                                                                    ? "filled"
                                                                    : "outlined"
                                                            }
                                                        />

                                                    </TableCell>

                                                    <TableCell
                                                        align="right"
                                                    >

                                                        {user.role ===
                                                        "USER" ? (

                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    openResetDialog(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                Reset Password
                                                            </Button>

                                                        ) : (

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                Protected
                                                            </Typography>

                                                        )}

                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )

                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </Paper>

            </Box>


            <Dialog
                open={Boolean(resetUser)}
                onClose={closeResetDialog}
                fullWidth
                maxWidth="xs"
            >

                <DialogTitle>
                    Reset Password
                </DialogTitle>

                <DialogContent>

                    {resetUser && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 2
                            }}
                        >
                            Set a new password for{" "}
                            <strong>
                                {resetUser.name}
                            </strong>
                            . Their existing login
                            session will be revoked.
                        </Typography>

                    )}


                    {resetError && (

                        <Alert
                            severity="error"
                            sx={{
                                mb: 2
                            }}
                        >
                            {resetError}
                        </Alert>

                    )}


                    <TextField
                        autoFocus
                        label="New Password"
                        type="password"
                        value={resetPassword}
                        onChange={(event) => {
                            setResetPassword(
                                event.target.value
                            );
                            setResetError("");
                        }}
                        required
                        fullWidth
                        disabled={resetLoading}
                        inputProps={{
                            minLength: 8
                        }}
                        helperText={
                            "Minimum 8 characters."
                        }
                        sx={{
                            mb: 2
                        }}
                    />


                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(
                                event.target.value
                            );
                            setResetError("");
                        }}
                        required
                        fullWidth
                        disabled={resetLoading}
                        inputProps={{
                            minLength: 8
                        }}
                    />

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={closeResetDialog}
                        disabled={resetLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleResetPassword
                        }
                        disabled={
                            resetLoading ||
                            resetPassword.length < 8 ||
                            confirmPassword.length < 8
                        }
                    >

                        {resetLoading ? (
                            <CircularProgress
                                size={20}
                            />
                        ) : (
                            "Reset Password"
                        )}

                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}
