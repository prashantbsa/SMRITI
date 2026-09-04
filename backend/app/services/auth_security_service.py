import hashlib
import secrets

import bcrypt


def hash_password(password: str) -> str:
    """
    Create a bcrypt hash for a portal user password.

    The original password is never stored.
    """
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        raise ValueError(
            "Password must not exceed 72 UTF-8 bytes."
        )

    return bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    """
    Verify a plaintext password against its bcrypt hash.
    """
    try:
        password_bytes = password.encode("utf-8")

        if len(password_bytes) > 72:
            return False

        return bcrypt.checkpw(
            password_bytes,
            password_hash.encode("utf-8"),
        )

    except (ValueError, TypeError):
        return False


def generate_session_token() -> str:
    """
    Generate a cryptographically secure session token.

    The raw token is returned to the browser but is never
    stored directly in the database.
    """
    return secrets.token_urlsafe(48)


def hash_session_token(token: str) -> str:
    """
    Create the SHA-256 representation stored in portal_sessions.
    """
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()
