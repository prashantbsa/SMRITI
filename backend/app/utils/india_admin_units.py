"""
Canonical Indian States and Union Territories.

This module normalizes state/UT names received from
different data sources and languages into one canonical
English administrative-unit name.

The original value in the database is NOT modified.
"""


# --------------------------------------------------
# Canonical Indian administrative units
# --------------------------------------------------

INDIA_ADMIN_UNITS = {

    # -------------------------------
    # States
    # -------------------------------

    "Andhra Pradesh": "Andhra Pradesh",

    "Arunachal Pradesh": "Arunachal Pradesh",

    "Assam": "Assam",

    "Bihar": "Bihar",

    "Chhattisgarh": "Chhattisgarh",

    "Goa": "Goa",

    "Gujarat": "Gujarat",

    "Haryana": "Haryana",

    "Himachal Pradesh": "Himachal Pradesh",

    "Jharkhand": "Jharkhand",

    "Karnataka": "Karnataka",

    "Kerala": "Kerala",

    "Madhya Pradesh": "Madhya Pradesh",

    "Maharashtra": "Maharashtra",

    "Manipur": "Manipur",

    "Meghalaya": "Meghalaya",

    "Mizoram": "Mizoram",

    "Nagaland": "Nagaland",

    "Odisha": "Odisha",

    "Punjab": "Punjab",

    "Rajasthan": "Rajasthan",

    "Sikkim": "Sikkim",

    "Tamil Nadu": "Tamil Nadu",

    "Telangana": "Telangana",

    "Tripura": "Tripura",

    "Uttar Pradesh": "Uttar Pradesh",

    "Uttarakhand": "Uttarakhand",

    "West Bengal": "West Bengal",


    # -------------------------------
    # Union Territories
    # -------------------------------

    "Andaman and Nicobar Islands":
        "Andaman and Nicobar Islands",

    "Chandigarh":
        "Chandigarh",

    "Dadra and Nagar Haveli and Daman and Diu":
        "Dadra and Nagar Haveli and Daman and Diu",

    "Delhi":
        "Delhi",

    "Jammu and Kashmir":
        "Jammu and Kashmir",

    "Ladakh":
        "Ladakh",

    "Lakshadweep":
        "Lakshadweep",

    "Puducherry":
        "Puducherry",
}


# --------------------------------------------------
# Alternate names / multilingual names
# --------------------------------------------------

STATE_ALIASES = {

    # --------------------------------
    # Andhra Pradesh
    # --------------------------------

    "ఆంధ్రప్రదేశ్":
        "Andhra Pradesh",


    # --------------------------------
    # Chhattisgarh
    # --------------------------------

    "छत्तीसगढ़":
        "Chhattisgarh",


    # --------------------------------
    # Gujarat
    # --------------------------------

    "गुजरात":
        "Gujarat",

    "ગુજરાત":
        "Gujarat",


    # --------------------------------
    # Haryana
    # --------------------------------

    "हरियाणा":
        "Haryana",

    "ਹਰਿਆਣਾ":
        "Haryana",


    # --------------------------------
    # Karnataka
    # --------------------------------

    "कर्नाटक":
        "Karnataka",


    # --------------------------------
    # Madhya Pradesh
    # --------------------------------

    "मध्य प्रदेश":
        "Madhya Pradesh",


    # --------------------------------
    # Maharashtra
    # --------------------------------

    "महाराष्ट्र":
        "Maharashtra",


    # --------------------------------
    # Odisha
    # --------------------------------

    "ଓଡିଶା":
        "Odisha",

    "ଓଡ଼ିଶା":
        "Odisha",

    "ఒడిషా":
        "Odisha",


    # --------------------------------
    # Punjab
    # --------------------------------

    "ਪੰਜਾਬ":
        "Punjab",


    # --------------------------------
    # Rajasthan
    # --------------------------------

    "राजस्थान":
        "Rajasthan",


    # --------------------------------
    # Tamil Nadu
    # --------------------------------

    "தமிழ்நாடு":
        "Tamil Nadu",


    # --------------------------------
    # Telangana
    # --------------------------------

    "తెలంగాణ":
        "Telangana",


    # --------------------------------
    # Uttar Pradesh
    # --------------------------------

    "उत्तर प्रदेश":
        "Uttar Pradesh",


    # --------------------------------
    # West Bengal
    # --------------------------------

    "পশ্চিমবঙ্গ":
        "West Bengal",


    # --------------------------------
    # Puducherry
    # --------------------------------

    "புதுச்சேரி":
        "Puducherry",


    # --------------------------------
    # Delhi
    # --------------------------------

    "New Delhi":
        "Delhi",

    "NCT Of Delhi":
        "Delhi",

    "NCT of Delhi":
        "Delhi",

    "NCT Delhi":
        "Delhi",


    # --------------------------------
    # Jammu & Kashmir
    # --------------------------------

    "Jammu & Kashmir":
        "Jammu and Kashmir",

    "Jammu and Kashmir":
        "Jammu and Kashmir",

}


# --------------------------------------------------
# Normalization function
# --------------------------------------------------

def normalize_indian_admin_unit(value):
    """
    Convert a state/UT name from an imported observation
    into the canonical English administrative-unit name.

    Unknown values are returned in cleaned form so that
    we do not silently destroy information.
    """

    if value is None:
        return "Unknown"

    value = str(value).strip()

    if not value:
        return "Unknown"

    # Exact alias
    if value in STATE_ALIASES:
        return STATE_ALIASES[value]

    # Already canonical
    if value in INDIA_ADMIN_UNITS:
        return INDIA_ADMIN_UNITS[value]

    # Case-insensitive matching
    normalized = value.casefold()

    for name, canonical in INDIA_ADMIN_UNITS.items():

        if normalized == name.casefold():
            return canonical

    for alias, canonical in STATE_ALIASES.items():

        if normalized == alias.casefold():
            return canonical

    # Unknown value.
    #
    # Keep it visible rather than silently mapping
    # it to a potentially incorrect state.
    return value
