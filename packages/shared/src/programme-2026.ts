export type Category =
  | "All"
  | "Lecture"
  | "Prayer"
  | "Recitation & Poem"
  | "Ceremony & Awards"
  | "Meal"
  | "Translation & Q&A";

export interface ProgrammeItem {
  id: string;
  time: string;
  session: string;
  category: Exclude<Category, "All">;
  title: string;
  titleSuffix?: string;
  inlineArabicSup?: string;
  arabic?: string;
  topic?: string;
  facilitator?: string;
  panel?: string[];
  highlight?: boolean;
}

export interface ProgrammeDay {
  id: string;
  shortLabel: string;
  fullLabel: string;
  dateISO: string;
  subtitle: string;
  items: ProgrammeItem[];
}

export const JALSA_2026_META = {
  organization: "Ahmadiyya Muslim Jama’at of Nigeria",
  eventTitle: "72nd Jalsa Salana",
  datesDisplay: "18th, 19th & 20th December 2026",
  venue: "Jamia Ahmadiyya Ilaro, Ogun State",
  theme:
    "Observing Justice and Human Rights: The foundation for true Global Peace",
  pdfDownloadUrl: "/downloads/72nd-jalsa-salana-nigeria-2026-programme.pdf",
  closingBenediction:
    "FI ‘AMANILLAH; MAY ALLAH THE ALMIGHTY GRANT EVERYBODY HIS JOURNEY MERCIES",
} as const;

export const PROGRAMME_DAYS: ProgrammeDay[] = [
  {
    id: "friday",
    shortLabel: "Day 1 · Fri 18 Dec",
    fullLabel: "Friday 18th December 2026",
    dateISO: "2026-12-18",
    subtitle: "Jumu’ah Services, Live Huzur’s Sermon & Opening First Session (5:00 PM)",
    items: [
      {
        id: "f1",
        time: "4:30 AM – 5:25 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Tahajjud",
        facilitator: "Imam: Respected Hafiz AbdutTawwab Bello sahib, Ilaro",
      },
      {
        id: "f2",
        time: "5:30 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Fajr Adhan",
        facilitator:
          "Respected Mustapha Ibrahim Aya Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "f3",
        time: "5:45 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Fajr",
      },
      {
        id: "f4",
        time: "6:00 AM – 6:15 AM",
        session: "Morning Worship",
        category: "Lecture",
        title: "Morning Dars",
        topic:
          "“Love for All, Hatred for None: Championing Universal Human Rights and Dignity”",
        facilitator:
          "Respected Nabeel-Ahmad Oyekola Sahib, Muballigh Silsila, Ilaro",
      },
      {
        id: "f5",
        time: "8:00 AM",
        session: "Hospitality & Seminar",
        category: "Meal",
        title: "Breakfast",
      },
      {
        id: "f6",
        time: "10:00 AM – 12:00 PM",
        session: "Hospitality & Seminar",
        category: "Lecture",
        title: "Tabligh Seminar",
      },
      {
        id: "f7",
        time: "12:30 PM",
        session: "Jumu’ah Services",
        category: "Prayer",
        title: "Preparation for Salatul Jumu’ah & First Adhan",
        facilitator:
          "Respected Hafiz Rufai Saleem Ahmad Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "f8",
        time: "1:00 PM",
        session: "Jumu’ah Services",
        category: "Prayer",
        title: "Second Adhan",
        facilitator:
          "Respected Hafiz Rufai Saleem Ahmad Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "f9",
        time: "1:05 PM – 1:50 PM",
        session: "Jumu’ah Services",
        category: "Prayer",
        title: "Jumu’at Services and Asr Prayer",
      },
      {
        id: "f10",
        time: "2:00 PM",
        session: "MTA Broadcast",
        category: "Lecture",
        title: "Live Huzur’s Sermon",
        facilitator: "Naazim Sahib Audio Visual Department",
        highlight: true,
      },
      {
        id: "f11",
        time: "3:00 PM",
        session: "Hospitality",
        category: "Meal",
        title: "Lunch",
      },
      {
        id: "f12",
        time: "5:00 PM",
        session: "First Session",
        category: "Ceremony & Awards",
        title: "Hoisting of Flags with Silent Prayers",
        topic: "Liwa-i-Ahmadiyya & Nigeria National Flag",
        highlight: true,
      },
      {
        id: "f13",
        time: "5:10 PM",
        session: "First Session",
        category: "Ceremony & Awards",
        title: "Introduction of Guests",
        facilitator: "Officer Sahib Jalsa Gah",
      },
      {
        id: "f14",
        time: "5:20 PM – 5:30 PM",
        session: "First Session",
        category: "Recitation & Poem",
        title: "Recitation from the Holy Qur’an with Translation",
        facilitator:
          "Respected Hafiz Sharafadeen Adeleke Sahib, Awoyaya, Lagos Island",
      },
      {
        id: "f15",
        time: "5:30 PM – 5:40 PM",
        session: "First Session",
        category: "Recitation & Poem",
        title: "Arabic Qaseedah with Translation",
        facilitator: "Respected Hafiz AbdurRoqeeb Alaka Sahib, Ilaro",
      },
      {
        id: "f16",
        time: "5:40 PM – 6:20 PM",
        session: "First Session",
        category: "Lecture",
        title: "Lecture One: Message from Hazrat Khalifatul Masih V",
        inlineArabicSup: "ايده الله تعلى بنصره العزيز",
        titleSuffix: " / Inaugural Address",
        facilitator:
          "Respected Amir Sahib, Ahmadiyya Muslim Jama’at of Nigeria, Alhaji Alatoye Folorunso Azeez Sahib",
        highlight: true,
      },
      {
        id: "f17",
        time: "6:20 PM – 6:35 PM",
        session: "First Session",
        category: "Translation & Q&A",
        title: "Yoruba Translation",
      },
      {
        id: "f18",
        time: "6:35 PM – 6:50 PM",
        session: "First Session",
        category: "Translation & Q&A",
        title: "Hausa Translation",
      },
      {
        id: "f19",
        time: "6:50 PM",
        session: "First Session",
        category: "Ceremony & Awards",
        title: "Announcements",
        facilitator: "Officer Sahib Jalsa Gah",
      },
      {
        id: "f20",
        time: "7:00 PM",
        session: "Evening Worship",
        category: "Prayer",
        title: "Adhan for Maghrib and Ishaa Prayers",
        facilitator:
          "Respected Hafiz Makinde Hussain Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "f21",
        time: "7:10 PM",
        session: "Evening Worship",
        category: "Prayer",
        title: "Maghrib and Ishaa Prayers",
      },
      {
        id: "f22",
        time: "7:30 PM",
        session: "Hospitality",
        category: "Meal",
        title: "Dinner",
      },
    ],
  },
  {
    id: "saturday",
    shortLabel: "Day 2 · Sat 19 Dec",
    fullLabel: "Saturday 19th December 2026",
    dateISO: "2026-12-19",
    subtitle:
      "Keynote Theme Lecture, Progress Report, Academic Awards, Nikaah & Q&A",
    items: [
      {
        id: "s1",
        time: "4:30 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Tahajjud",
        facilitator: "Imam: Respected Hafiz Faruq Ademoye Sahib, Ilorin Circuit",
      },
      {
        id: "s2",
        time: "5:30 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Adhan",
        facilitator:
          "Respected Hafiz Hasbiyallah Gbadegeshin Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "s3",
        time: "5:45 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Fajr",
      },
      {
        id: "s4",
        time: "5:55 AM – 6:10 AM",
        session: "Morning Worship",
        category: "Lecture",
        title: "Dars Topic",
        topic:
          "“Characteristics of a True Believer: Address of Hazrat Khalifatul Masih V (aba) to the Ijtema, Lajna Imaillah UK 2026”",
        facilitator:
          "Respected Jubril Akintunde Sahib, Muallim Silsila, Nasarawa",
      },
      {
        id: "s5",
        time: "8:00 AM",
        session: "Hospitality",
        category: "Meal",
        title: "Breakfast",
      },
      {
        id: "s6",
        time: "10:00 AM",
        session: "Second Session",
        category: "Ceremony & Awards",
        title: "All Participants and Guests Seated at the Jalsa Gah",
      },
      {
        id: "s7",
        time: "10:00 AM – 10:20 AM",
        session: "Second Session",
        category: "Ceremony & Awards",
        title: "Introduction and Recognition of Guests",
        facilitator: "Officer Sahib Jalsa Gah",
      },
      {
        id: "s8",
        time: "10:20 AM – 10:30 AM",
        session: "Second Session",
        category: "Recitation & Poem",
        title: "Recitation from the Holy Qur’an with English Translation",
        facilitator: "Respected Ahmad Abdullah Sahib, Muallim Silsila, Ilaro",
      },
      {
        id: "s9",
        time: "10:40 AM – 10:50 AM",
        session: "Second Session",
        category: "Recitation & Poem",
        title: "Arabic Poem",
        facilitator:
          "Respected Muhammad AlFayyad Timehin Sahib, Muballigh Silsila, Warri",
      },
      {
        id: "s10",
        time: "10:50 AM – 11:20 AM",
        session: "Second Session",
        category: "Lecture",
        title: "Lecture Two (Theme Keynote)",
        topic:
          "“Observing Justice and Human Rights: The foundation for true Global Peace”",
        facilitator:
          "Respected Dr Abdussalaam Kofo Alada Sahib, Naib Amir & President Ahmadi-Muslim Lawyers’ Association of Nigeria",
        highlight: true,
      },
      {
        id: "s11",
        time: "11:20 AM – 11:30 AM",
        session: "Second Session",
        category: "Translation & Q&A",
        title: "Hausa Translation",
      },
      {
        id: "s12",
        time: "11:30 AM – 11:35 AM",
        session: "Second Session",
        category: "Translation & Q&A",
        title: "Yoruba Translation",
      },
      {
        id: "s13",
        time: "11:35 AM – 11:45 AM",
        session: "Second Session",
        category: "Recitation & Poem",
        title: "Urdu Poem with Translation",
        facilitator:
          "Respected Fareed Ibrahim AbdulWarith Sahib, Muallim Silsila Benin City",
      },
      {
        id: "s14",
        time: "11:45 AM – 12:25 PM",
        session: "Second Session",
        category: "Lecture",
        title:
          "Lecture Three: Annual Progress Report about Ahmadiyya Muslim Jama’at of Nigeria",
        arabic: "ذٰلِکَ فَضۡلُ اللّٰہِ یُؤۡتِیۡہِ مَنۡ یَّشَآءُ",
        facilitator:
          "The Respected Amir, Ahmadiyya Muslim Jama’at, Alhaji Alatoye Folorunso Azeez Sahib",
        highlight: true,
      },
      {
        id: "s15",
        time: "12:25 PM – 1:25 PM",
        session: "Second Session",
        category: "Ceremony & Awards",
        title: "AMJN Academic Merit Awards",
        facilitator:
          "Coordinator: National Ta’leem Secretary, Respected Engr. Tajudeen Oladoja Sahib",
        highlight: true,
      },
      {
        id: "s16",
        time: "1:25 PM – 2:05 PM",
        session: "Second Session",
        category: "Ceremony & Awards",
        title: "Short Speeches by Guests",
      },
      {
        id: "s17",
        time: "2:05 PM – 2:10 PM",
        session: "Second Session",
        category: "Prayer",
        title: "Closing of Session and Silent Prayer",
      },
      {
        id: "s18",
        time: "2:10 PM",
        session: "Afternoon Break",
        category: "Meal",
        title: "Visit to Exhibition Stands by Invited Guests & Lunch",
      },
      {
        id: "s19",
        time: "4:00 PM",
        session: "Afternoon Worship",
        category: "Prayer",
        title: "Adhan for Zuhr and Asr Prayers",
        facilitator:
          "Respected Hafiz Abdullah Mustapha Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "s20",
        time: "4:05 PM – 4:20 PM",
        session: "Afternoon Worship",
        category: "Prayer",
        title: "Salatuz Zuhr and Asr",
      },
      {
        id: "s21",
        time: "4:20 PM – 4:50 PM",
        session: "Afternoon Worship",
        category: "Ceremony & Awards",
        title: "Solemnization of Approved Nikaah",
        highlight: true,
      },
      {
        id: "s22",
        time: "4:50 PM – 5:00 PM",
        session: "Third Session",
        category: "Recitation & Poem",
        title: "Recitation from the Holy Qur’an with Translation",
        facilitator: "Respected Hafiz Habeebullah Akewugberu Sahib, Kano",
      },
      {
        id: "s23",
        time: "5:00 PM – 5:10 PM",
        session: "Third Session",
        category: "Recitation & Poem",
        title: "Arabic Qaseedah with Translation",
        facilitator: "A Group of Jamia Ahmadiyya Nigeria Students",
      },
      {
        id: "s24",
        time: "5:10 PM – 5:40 PM",
        session: "Third Session",
        category: "Lecture",
        title: "Lecture Four",
        arabic: "توكل على الله",
        topic:
          "“توكل على الله : A Pious Legacy of the Holy Prophet (sa) and the Promised Messiah (as)”",
        facilitator:
          "Mukarram Adnan Tahir Sahib, Muballigh Silsila, Respected Missionary Incharge Sahib",
        highlight: true,
      },
      {
        id: "s25",
        time: "5:40 PM – 5:50 PM",
        session: "Third Session",
        category: "Translation & Q&A",
        title: "Hausa Translation",
      },
      {
        id: "s26",
        time: "5:50 PM – 6:00 PM",
        session: "Third Session",
        category: "Translation & Q&A",
        title: "Yoruba Translation",
      },
      {
        id: "s27",
        time: "6:00 PM",
        session: "Third Session",
        category: "Ceremony & Awards",
        title: "Announcements",
      },
      {
        id: "s28",
        time: "6:10 PM",
        session: "Third Session",
        category: "Prayer",
        title: "Silent Prayers",
      },
      {
        id: "s29",
        time: "7:00 PM",
        session: "Evening Activities",
        category: "Prayer",
        title: "Adhan for Maghrib and Ishaa Prayers",
        facilitator:
          "Respected Mustapha Ibrahim Aya Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "s30",
        time: "7:10 PM",
        session: "Evening Activities",
        category: "Prayer",
        title: "Maghrib and Ishaa Prayers",
      },
      {
        id: "s31",
        time: "7:25 PM – 8:00 PM",
        session: "Evening Activities",
        category: "Ceremony & Awards",
        title: "The Respected Amir Sahib’s Meeting with Nau Muba’een",
      },
      {
        id: "s32",
        time: "7:25 PM – 9:00 PM",
        session: "Evening Activities",
        category: "Meal",
        title: "Dinner",
      },
      {
        id: "s33",
        time: "8:00 PM – 9:00 PM",
        session: "Evening Activities",
        category: "Translation & Q&A",
        title: "Questions and Answer Session",
        highlight: true,
        panel: [
          "Respected Prof. AbdulMajeed Hassan Bello Sahib, President Qadhaa Board – Chairman",
          "Respected Abdur Rasheed Adegbola Sanni Sahib, Muballigh Silsila, Agege",
          "Respected Misbahudeen Akintola Sahib, Muallim Silsila, Akwanga",
          "Respected AbdulHakeem Adetona Awwal Sahib, Muallim Silsila, Ojokoro",
          "Respected Sodiq Kehinde Abdul Raheem Sahib, Muballigh Silsila, Port Harcourt",
          "Respected Zeeshan Sahib, Muballigh Silsila, Ilaro",
        ],
      },
    ],
  },
  {
    id: "sunday",
    shortLabel: "Day 3 · Sun 20 Dec",
    fullLabel: "Sunday 20th December 2026",
    dateISO: "2026-12-20",
    subtitle: "Closing Session, Lecture Five & Concluding Prayers",
    items: [
      {
        id: "u1",
        time: "4:30 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Tahajjud",
        facilitator:
          "Imam: Respected Maulvi Hafiz Abdun Nasiir Abdul Hameed Sahib, Muballigh Silsila, Auchi",
      },
      {
        id: "u2",
        time: "5:30 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Fajr Adhan",
        facilitator:
          "Respected Hafiz Rufai Saleem Ahmad Sahib, Jamia Ahmadiyya Nigeria",
      },
      {
        id: "u3",
        time: "5:45 AM",
        session: "Morning Worship",
        category: "Prayer",
        title: "Salatul Fajr",
      },
      {
        id: "u4",
        time: "6:00 AM – 6:10 AM",
        session: "Closing Session",
        category: "Recitation & Poem",
        title: "Recitation from the Holy Qur’an with Translation",
        facilitator: "Respected Hafiz Emanubillah Uthman Sahib, Lagos Island",
      },
      {
        id: "u5",
        time: "6:10 AM – 6:20 AM",
        session: "Closing Session",
        category: "Recitation & Poem",
        title: "Arabic Qaseedah with Translation",
        facilitator:
          "Respected Hafiz AbdurRofeeq Alaka Sahib, Sadr Majlis Khuddamul Ahmadiyya, Nigeria",
      },
      {
        id: "u6",
        time: "6:20 AM – 6:50 AM",
        session: "Closing Session",
        category: "Lecture",
        title: "Lecture Five",
        arabic: "انَّ اللّٰہَ یَاۡمُرُکُمۡ اَنۡ تُؤَدُّوا الۡاَمٰنٰتِ اِلٰۤی اَہۡلِہَا",
        topic: "“انَّ اللّٰہَ یَاۡمُرُکُمۡ اَنۡ تُؤَدُّوا الۡاَمٰنٰتِ اِلٰۤی اَہۡلِہَا” : Key to National Growth and Development",
        facilitator:
          "Respected Prof. AbdurRahman Abdullah Sahib – Vice Chancellor, Minaret University, Ikirun",
        highlight: true,
      },
      {
        id: "u7",
        time: "6:50 AM – 7:00 AM",
        session: "Closing Session",
        category: "Translation & Q&A",
        title: "Yoruba Translation",
      },
      {
        id: "u8",
        time: "7:00 AM – 7:10 AM",
        session: "Closing Session",
        category: "Translation & Q&A",
        title: "Hausa Translation",
      },
      {
        id: "u9",
        time: "7:10 AM – 7:40 AM",
        session: "Closing Session",
        category: "Lecture",
        title: "Closing Address & Closing Prayers",
        facilitator:
          "The Respected Amir Sahib, Alhaji Alatoye Folorunso Azeez Sahib",
        highlight: true,
      },
      {
        id: "u10",
        time: "7:40 AM – 9:00 AM",
        session: "Departure",
        category: "Meal",
        title: "Breakfast and General Cleaning",
      },
    ],
  },
];
