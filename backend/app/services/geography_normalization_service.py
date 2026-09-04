# --------------------------------------------------
# COMMON TEXT CLEANING
# --------------------------------------------------

def clean_name(value):

    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    # Normalize different dash characters.
    value = (
        value
        .replace("–", "-")
        .replace("—", "-")
        .replace("−", "-")
    )

    # Collapse repeated whitespace.
    value = " ".join(
        value.split()
    )

    return value


def lookup_key(value):

    value = clean_name(
        value
    )

    if not value:
        return None

    return value.casefold()


# ==================================================
# STATE NORMALIZATION
# ==================================================

STATE_ALIASES = {

    # Rajasthan
    "राजस्थान": "Rajasthan",
    "rajasthan": "Rajasthan",

    # Uttar Pradesh
    "उत्तर प्रदेश": "Uttar Pradesh",
    "uttar pradesh": "Uttar Pradesh",

    # Maharashtra
    "महाराष्ट्र": "Maharashtra",
    "maharashtra": "Maharashtra",

    # Gujarat
    "गुजरात": "Gujarat",
    "ગુજરાત": "Gujarat",
    "gujarat": "Gujarat",

    # Karnataka
    "कर्नाटक": "Karnataka",
    "ಕರ್ನಾಟಕ": "Karnataka",
    "కర్ణాటక": "Karnataka",
    "karnataka": "Karnataka",

    # Madhya Pradesh
    "मध्य प्रदेश": "Madhya Pradesh",
    "madhya pradesh": "Madhya Pradesh",

    # Chhattisgarh
    "छत्तीसगढ़": "Chhattisgarh",
    "chhattisgarh": "Chhattisgarh",

    # Haryana
    "हरियाणा": "Haryana",
    "ਹਰਿਆਣਾ": "Haryana",
    "haryana": "Haryana",

    # Punjab
    "पंजाब": "Punjab",
    "ਪੰਜਾਬ": "Punjab",
    "punjab": "Punjab",

    # West Bengal
    "पश्चिम बंगाल": "West Bengal",
    "পশ্চিমবঙ্গ": "West Bengal",
    "west bengal": "West Bengal",

    # Odisha
    "ओडिशा": "Odisha",
    "ଓଡିଶା": "Odisha",
    "ఒడిషా": "Odisha",
    "odisha": "Odisha",

    # Tamil Nadu
    "तमिलनाडु": "Tamil Nadu",
    "தமிழ்நாடு": "Tamil Nadu",
    "tamil nadu": "Tamil Nadu",

    # Puducherry
    "पुदुचेरी": "Puducherry",
    "புதுச்சேரி": "Puducherry",
    "puducherry": "Puducherry",

    # Andhra Pradesh
    "आंध्र प्रदेश": "Andhra Pradesh",
    "ఆంధ్రప్రదేశ్": "Andhra Pradesh",
    "andhra pradesh": "Andhra Pradesh",

    # Telangana
    "तेलंगाना": "Telangana",
    "తెలంగాణ": "Telangana",
    "telangana": "Telangana",

    # Uttarakhand
    "उत्तराखंड": "Uttarakhand",
    "uttarakhand": "Uttarakhand",

    # Jharkhand
    "झारखंड": "Jharkhand",
    "jharkhand": "Jharkhand",

    # Nagaland
    "nagaland": "Nagaland",
}


# ==================================================
# DISTRICT NORMALIZATION
# ==================================================

DISTRICT_ALIASES = {

    # --------------------------------------------------
    # Rajasthan
    # --------------------------------------------------

    "सवाईमाधोपुर": "Sawai Madhopur",
    "सवाई माधोपुर": "Sawai Madhopur",
    "sawai madhopur": "Sawai Madhopur",
    "sawai madhopur district": "Sawai Madhopur",

    "चुरू": "Churu",
    "नागौर": "Nagaur",
    "जोधपुर": "Jodhpur",
    "चित्तौड़गढ़": "Chittorgarh",
    "chittorgarh": "Chittorgarh",

    "बाड़मेर": "Barmer",
    "बीकानेर": "Bikaner",
    "जैसलमेर": "Jaisalmer",
    "झालावाड़": "Jhalawar",
    "भीलवाड़ा": "Bhilwara",
    "राजसमंद": "Rajsamand",
    "जयपुर": "Jaipur",
    "बूंदी": "Bundi",
    "पाली": "Pali",
    "हनुमानगढ़": "Hanumangarh",

    "गंगानगर": "Sri Ganganagar",
    "sri ganganagar": "Sri Ganganagar",


    # --------------------------------------------------
    # Uttar Pradesh
    # --------------------------------------------------

    "गोंडा": "Gonda",
    "प्रतापगढ़": "Pratapgarh",
    "सीतापुर": "Sitapur",
    "बाराबंकी": "Barabanki",

    "कानपुर-नगर": "Kanpur Nagar",
    "kanpur-nagar": "Kanpur Nagar",
    "kanpur nagar": "Kanpur Nagar",

    "बागपत": "Baghpat",
    "बरेली": "Bareilly",
    "सोनभद्र": "Sonbhadra",
    "शाहजहांपुर": "Shahjahanpur",
    "मिर्ज़ापुर": "Mirzapur",
    "बुलंदशहर": "Bulandshahr",
    "फतेहपुर": "Fatehpur",


    # --------------------------------------------------
    # Madhya Pradesh
    # --------------------------------------------------

    "नीमच": "Neemuch",
    "सागर": "Sagar",
    "छतरपुर": "Chhatarpur",
    "पन्ना": "Panna",
    "मंदसौर": "Mandsaur",
    "रायसेन": "Raisen",
    "सीधी": "Sidhi",
    "रतलाम": "Ratlam",
    "शाहडोल": "Shahdol",
    "भोपाल": "Bhopal",
    "राजगढ़": "Rajgarh",
    "सिवनी": "Seoni",
    "विदिशा": "Vidisha",

    "पूर्व निमाड़": "East Nimar",
    "east nimar": "East Nimar",

    "सिंगरौली": "Singrauli",
    "अशोकनगर": "Ashoknagar",
    "गुना": "Guna",
    "दतिया": "Datia",


    # --------------------------------------------------
    # Maharashtra
    # --------------------------------------------------

    "जालना": "Jalna",
    "नाशिक": "Nashik",
    "अमरावती": "Amravati",
    "पुणे": "Pune",
    "बुलढाणा": "Buldhana",
    "अकोला": "Akola",
    "नंदुरबार": "Nandurbar",

    "परभणी": "Parbhani",
    "परभनी": "Parbhani",
    "parbhani": "Parbhani",

    "पालघर": "Palghar",
    "palghar": "Palghar",

    "लातूर": "Latur",
    "नांदेड": "Nanded",
    "उस्मानाबाद": "Osmanabad",
    "वॉशिम": "Washim",
    "सोलापूर": "Solapur",
    "बीड": "Beed",
    "जळगाव": "Jalgaon",
    "सातारा": "Satara",
    "कोल्हापूर": "Kolhapur",


    # --------------------------------------------------
    # Chhattisgarh
    # --------------------------------------------------

    "बस्तर": "Bastar",
    "कबीरधाम": "Kabirdham",
    "कांकेर": "Kanker",
    "सूरजपुर": "Surajpur",
    "बिलासपुर": "Bilaspur",
    "जांजगीर-चंपा": "Janjgir-Champa",
    "कोरबा": "Korba",
    "कोंडागाँव": "Kondagaon",


    # --------------------------------------------------
    # Karnataka
    # --------------------------------------------------

    "बीदर": "Bidar",

    "ರಾಯಚೂರ್": "Raichur",
    "raichur": "Raichur",

    "ಯಾದ್ಗಿರ್": "Yadgir",

    "ಗುಲ್ಬರ್ಗಾ": "Gulbarga",

    "ಬಳ್ಳಾರಿ": "Ballari",
    "బళ్ళారి": "Ballari",
    "ballari": "Ballari",

    "ರಾಮನಗರ": "Ramanagara",

    "बीजापूर": "Vijayapura",

    "बेलागावी": "Belagavi",

    "ಕೋಲಾರ": "Kolar",

    "ಚಾಮರಾಜನಗರ": "Chamarajanagar",


    # --------------------------------------------------
    # Andhra Pradesh
    # --------------------------------------------------

    "గుంటూరు": "Guntur",
    "guntur": "Guntur",

    "కర్నూలు": "Kurnool",
    "kurnool": "Kurnool",

    "అనంతపూర్": "Anantapur",

    # English source variant
    "anantapuram": "Anantapur",
    "anantapur": "Anantapur",

    "కృష్ణ": "Krishna",

    "విజయనగరం": "Vizianagaram",

    "పశ్చిమ-గోదావరి":
        "West Godavari",

    "తూర్పు గోదావరి":
        "East Godavari",

    "y.s.r. (కడప)":
        "YSR Kadapa",

    "y.s.r.(kadapa)":
        "YSR Kadapa",

    "y.s.r. (kadapa)":
        "YSR Kadapa",

    "ysr kadapa":
        "YSR Kadapa",

    "spsr-నెల్లూరు":
        "SPSR Nellore",

    "spsr nellore":
        "SPSR Nellore",

    "sri potti sriramulu nellore":
        "SPSR Nellore",


    # --------------------------------------------------
    # Telangana
    # --------------------------------------------------

    "నిర్మల్": "Nirmal",

    "రంగారెడ్డి": "Ranga Reddy",

    "సిద్దిపేట": "Siddipet",

    "జగిత్యాల్": "Jagtial",

    "నిజామాబాదు": "Nizamabad",

    "సంగారెడ్డి": "Sangareddy",
    "sangareddy": "Sangareddy",

    "సూర్యాపేట": "Suryapet",

    "వరంగల్ పట్టణ": "Warangal Urban",

    "ఆదిలాబాద్": "Adilabad",

    "నల్గొండ": "Nalgonda",

    "వికారాబాద్": "Vikarabad",

    "కుమురం-భీమ్-ఆసిఫాబాద్":
        "Kumuram Bheem Asifabad",

    "medchal-malkajgiri":
        "Medchal-Malkajgiri",

    "nagarkurnool":
        "Nagarkurnool",


    # --------------------------------------------------
    # Gujarat
    # --------------------------------------------------

    "બનાસકાંઠા": "Banaskantha",

    "પાટણ": "Patan",
    "પાટન": "Patan",
    "पाटन": "Patan",
    "patan": "Patan",

    "ખેડા": "Kheda",

    "અમરેલી": "Amreli",

    "દેવભૂમિ-દ્વારકા":
        "Devbhumi Dwarka",

    "સુરેન્દ્રનગર":
        "Surendranagar",

    "આણંદ": "Anand",
    "આનંદ": "Anand",
    "anand": "Anand",

    "જામનગર": "Jamnagar",

    "મહેસાણા": "Mehsana",

    "મોર્બી": "Morbi",

    "ગીર-સોનાથ":
        "Gir Somnath",

    # જુનાગ remains intentionally unresolved.
    #
    # The source string appears incomplete /
    # truncated and should not be guessed.


    # --------------------------------------------------
    # Punjab
    # --------------------------------------------------

    "ਭਾਟੀਂਡਾ": "Bathinda",

    "ਸ੍ਰੀ ਮੁਕਤਸਰ-ਸਾਹਿਬ":
        "Sri Muktsar Sahib",

    "ਹੁਸ਼ਿਆਰਪੁਰ":
        "Hoshiarpur",


    # --------------------------------------------------
    # Odisha
    # --------------------------------------------------

    "କେଙ୍ଝର":
        "Kendujhar",

    "మల్కనగిరి":
        "Malkangiri",

    "ଗଅଞ୍ଜମ":
        "Ganjam",

    "ନୂଆପଡା":
        "Nuapada",


    # --------------------------------------------------
    # Tamil Nadu
    # --------------------------------------------------

    "தூத்துக்குடி":
        "Thoothukudi",

    "விருதுநகர்":
        "Virudhunagar",


    # --------------------------------------------------
    # Puducherry
    # --------------------------------------------------

    "புதுச்சேரி":
        "Puducherry",


    # --------------------------------------------------
    # Haryana
    # --------------------------------------------------

    "महेंद्रगढ़":
        "Mahendragarh",

    "रोहतक":
        "Rohtak",

    "ਸਿਰਸਾ":
        "Sirsa",


    # --------------------------------------------------
    # Uttarakhand
    # --------------------------------------------------

    "अल्मोड़ा":
        "Almora",


    # --------------------------------------------------
    # Jharkhand
    # --------------------------------------------------

    "देवघर":
        "Deoghar",


    # --------------------------------------------------
    # West Bengal
    # --------------------------------------------------

    "24 পরগণার-দক্ষিণ":
        "South 24 Parganas",


    # --------------------------------------------------
    # Delhi
    # --------------------------------------------------

    "नई दिल्ली":
        "New Delhi",

    "new delhi":
        "New Delhi",

    "दक्षिण पूर्व दिल्ली":
        "South East Delhi",

    "south east delhi":
        "South East Delhi",

    "south-east delhi":
        "South East Delhi",


    # --------------------------------------------------
    # Nagaland
    # --------------------------------------------------

    # This is already a legitimate Latin-script
    # official-style name containing a diacritic.
    # Preserve it rather than forcing ASCII.

    "chümoukedima":
        "Chümoukedima",
}


# ==================================================
# NORMALIZE STATE
# ==================================================

def normalize_state(value):

    state = clean_name(
        value
    )

    if not state:
        return None

    key = lookup_key(
        state
    )

    return STATE_ALIASES.get(
        key,
        state,
    )


# ==================================================
# NORMALIZE DISTRICT
# ==================================================

def normalize_district(value):

    district = clean_name(
        value
    )

    if not district:
        return None

    key = lookup_key(
        district
    )

    return DISTRICT_ALIASES.get(
        key,
        district,
    )
