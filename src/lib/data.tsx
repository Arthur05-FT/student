import Calendar2Icon from "@/components/icons/calendar.icon";
import ClasseIcon from "@/components/icons/classe.icon";
import Dashboard3Icon from "@/components/icons/course.icon";
import File2Icon from "@/components/icons/file.icon";
import HomeIcon from "@/components/icons/home.icon";
import Clipboard2Icon from "@/components/icons/matter.icon";
import NotificationBellIcon from "@/components/icons/notifications.icon";
import IdCardIcon from "@/components/icons/personel.icon";
import SettingsIcon from "@/components/icons/setting.icon";
import { Chart15Icon, ChartIcon } from "@/components/icons/statistics.icon";
import CalendarCheckIcon from "@/components/icons/timestable.icon";
import DollarIcon from "@/components/icons/tuition.icon";

export const schoolTypeData = [
  "École maternelle",
  "École primaire",
  "École secondaire",
  "Université",
  "École publique",
  "École privée",
  "École confessionnelle (catholique, protestante, etc.)",
  "Enseignement général",
  "Enseignement technique",
  "Enseignement professionnel",
  "École normale (formation des enseignants)",
  "École francophone",
  "École anglophone",
  "École bilingue",
  "École laïque",
  "École religieuse",
];

export const cityData = [
  "Yaoundé",
  "Douala",
  "Garoua",
  "Maroua",
  "Bamenda",
  "Bafoussam",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kribi",
  "Limbe",
  "Edéa",
  "Kumba",
  "Nkongsamba",
  "Dschang",
  "Foumban",
  "Bafang",
  "Mbouda",
  "Sangmélima",
  "Mbalmayo",
  "Obala",
  "Monatélé",
  "Eséka",
  "Akonolinga",
  "Yagoua",
  "Guider",
  "Tiko",
  "Wum",
];

export const countryData = [
  "Algérie",
  "Angola",
  "Bénin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroun",
  "République centrafricaine",
  "Tchad",
  "Comores",
  "République du Congo",
  "République démocratique du Congo",
  "Djibouti",
  "Égypte",
  "Érythrée",
  "Eswatini",
  "Éthiopie",
  "Gabon",
  "Gambie",
  "Ghana",
  "Guinée",
  "Guinée-Bissau",
  "Guinée équatoriale",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libye",
  "Madagascar",
  "Malawi",
  "Mali",
  "Maroc",
  "Maurice",
  "Mauritanie",
  "Mozambique",
  "Namibie",
  "Niger",
  "Nigeria",
  "Ouganda",
  "Rwanda",
  "Sao Tomé-et-Principe",
  "Sénégal",
  "Seychelles",
  "Sierra Leone",
  "Somalie",
  "Soudan",
  "Soudan du Sud",
  "Tanzanie",
  "Togo",
  "Tunisie",
  "Zambie",
  "Zimbabwe",
  "Afrique du Sud",
];

// sidebar
export const sideBarLinks = [
  {
    title: "Général",
    subtitle: [
      {
        name: "Accueil",
        link: "",
        icon: <HomeIcon size={"18"} />,
      },
      {
        name: "Notifications",
        link: "/notifications",
        icon: <NotificationBellIcon size={"18"} />,
      },
      {
        name: "Calendrier",
        link: "/calendar",
        icon: <Calendar2Icon size={"18"} />,
      },
    ],
  },
  {
    title: "École",
    subtitle: [
      {
        name: "Classes",
        link: "/classes",
        icon: <ClasseIcon size={"18"} />,
      },
      {
        name: "Personnel",
        link: "/personel",
        icon: <IdCardIcon size={"18"} />,
      },
      {
        name: "Paramètres",
        link: "/settings",
        icon: <SettingsIcon size={"18"} />,
      },
    ],
  },
  {
    title: "Académique",
    subtitle: [
      {
        name: "Matières",
        link: "/matter",
        icon: <Clipboard2Icon size={"18"} />,
      },
      {
        name: "Emplois du temps",
        link: "/timetables",
        icon: <CalendarCheckIcon size={"18"} />,
      },
      {
        name: "Cours",
        link: "/courses",
        icon: <Dashboard3Icon size={"18"} />,
      },
      {
        name: "Frais de scolarité",
        link: "/Tuition",
        icon: <DollarIcon size={"18"} />,
      },
    ],
  },
  {
    title: "Suivi & rapports",
    subtitle: [
      {
        name: "Rapports académiques",
        link: "/academic-report",
        icon: <File2Icon size={"18"} />,
      },
      {
        name: "Statistiques",
        link: "statistics",
        icon: <ChartIcon size={"18"} />,
      },
      {
        name: "Gestion des absences",
        link: "/absence-management",
        icon: <Chart15Icon size={"18"} />,
      },
    ],
  },
];

// classes

export const classesStatistics = [
  {
    name: "Nombre de salles",
    number: 32,
  },
  {
    name: "Elèves inscrits",
    number: 1042,
  },
  {
    name: "Professeurs affectés",
    number: 12,
  },
  {
    name: "Taux d'occupation",
    number: "78%",
  },
];
