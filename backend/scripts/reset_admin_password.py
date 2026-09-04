import getpass

from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.portal_user import PortalUser
from app.services.auth_security_service import hash_password
from app.services.auth_service import normalize_email


def main():
    db = SessionLocal()

    try:
        email = normalize_email(
            input("Admin email: ")
        )

        stmt = (
            select(PortalUser)
            .where(
                PortalUser.email == email,
                PortalUser.role == "ADMIN",
            )
            .limit(1)
        )

        user = db.execute(stmt).scalar_one_or_none()

        if user is None:
            print("ADMIN account not found.")
            return

        new_password = getpass.getpass(
            "New portal login password: "
        )

        confirm_password = getpass.getpass(
            "Confirm new portal login password: "
        )

        if new_password != confirm_password:
            print("Passwords do not match.")
            return

        if len(new_password) < 8:
            print(
                "Password must contain at least 8 characters."
            )
            return

        if len(new_password.encode("utf-8")) > 72:
            print(
                "Password must not exceed 72 UTF-8 bytes."
            )
            return

        user.password_hash = hash_password(
            new_password
        )

        db.commit()

        print()
        print(
            "Portal ADMIN password updated successfully."
        )
        print("Email:", user.email)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()
