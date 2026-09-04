const API_BASE_URL = "http://192.168.12.160:8000";


async function apiRequest(path, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {

        const error = new Error(
            data?.detail ||
            "Unable to complete the request."
        );

        error.status = response.status;

        throw error;
    }

    return data;
}


export async function login(
    email,
    password
) {

    return apiRequest(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }
    );
}


export async function getCurrentUser() {

    return apiRequest(
        "/auth/me",
        {
            method: "GET"
        }
    );
}


export async function logout() {

    return apiRequest(
        "/auth/logout",
        {
            method: "POST"
        }
    );
}


export async function createPortalUser({
    name,
    email,
    contactNo,
    office,
    password
}) {

    return apiRequest(
        "/admin/users",
        {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                contact_no: contactNo,
                office,
                password
            })
        }
    );
}

export async function getPortalUsers() {

    return apiRequest(
        "/admin/users",
        {
            method: "GET"
        }
    );
}


export async function resetPortalUserPassword(
    userId,
    password
) {

    return apiRequest(
        `/admin/users/${userId}/reset-password`,
        {
            method: "POST",
            body: JSON.stringify({
                password
            })
        }
    );
}
