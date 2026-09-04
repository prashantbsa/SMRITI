import getpass
import sys

from sqlalchemy import func, select

from app.db.database import SessionLocal
from app.models.portal_user import PortalUser
from app.services.auth_security_service import hash_password
from app.services.auth_service import normalize_email


def main():
    db = SessionLocal()

    try:
        existing_admin_count = db.scalar(
            select(func.count(PortalUser.id)).where(
                PortalUser.role == "ADMIN"
            )
        )

        if existing_admin_count:
            print("An ADMIN account already exists.")
            print("No additional ADMIN account was created.")
            return

        print("Create initial SMRITI administrator")
        print("-----------------------------------")

        name = input("Name: ").strip()
        email = normalize_email(input("Email: "))
        contact_no = input("Contact No: ").strip()
        office = input("Office: ").strip()

        if not name or not email or not contact_no or not office:
            print("All fields are required.")
            sys.exit(1)

        existing_email = db.scalar(
            select(PortalUser.id)
            .where(PortalUser.email == email)
            .limit(1)
        )

        if existing_email is not None:
            print("A portal user with this email already exists.")
            sys.exit(1)

        password = getpass.getpass("Password: ")
        confirm_password = getpass.getpass("Confirm Password: ")

        if password != confirm_password:
            print("Passwords do not match.")
            sys.exit(1)

        if len(password) < 8:
            print("Password must contain at least 8 characters.")
            sys.exit(1)

        if len(password.encode("utf-8")) > 72:
            print("Password must not exceed 72 UTF-8 bytes.")
            sys.exit(1)

        user = PortalUser(
            name=name,
            email=email,
            contact_no=contact_no,
            office=office,
            password_hash=hash_password(password),
            role="ADMIN",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print()
        print("SMRITI ADMIN account created successfully.")
        print("User ID:", user.id)
        print("Name:", user.name)
        print("Email:", user.email)
        print("Role:", user.role)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()
