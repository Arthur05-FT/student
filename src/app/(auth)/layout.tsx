import { Separator } from "@/components/ui/separator";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

const instrument_serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stat = [
    { value: 1245, label: "Etablissements" },
    { value: 312, label: "Utilisateurs" },
    { value: 10, label: "Région du cmr" },
  ];

  return (
    <div className="flex">
      <div className="flex flex-col justify-between h-screen bg-emerald-950 text-white pl-10 pt-4 pb-20 flex-1">
        <div className="flex flex-col gap-2">
          <h1 className={instrument_serif.className + " text-4xl font-bold"}>
            Name_
          </h1>
          <p className="uppercase font-light text-xs">
            Plateforme de gestion scolaire
          </p>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p
              className={
                "max-w-3xl text-6xl italic " + instrument_serif.className
              }
            >
              « L'éducation est l'arme la plus puissante pour changer le monde.
              »
            </p>
            <span className="block text-xs uppercase font-light mt-2">
              ~ Nelson Mandela
            </span>
          </div>
          <Separator className="bg-emerald-900 max-w-3xl" />
          <div className="flex gap-4">
            {stat.map((item, index) => (
              <div key={index} className="flex gap-2 flex-col">
                <span
                  className={jetbrains_mono.className + " text-2xl font-bold"}
                >
                  {item.value}
                </span>
                <span className="uppercase text-xs">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <span className={jetbrains_mono.className + " text-xs"}>
              © 2026 Name_ SAS · Yaoundé · Douala
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
