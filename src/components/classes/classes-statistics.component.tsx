import { classesStatistics } from "@/lib/data";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ClassesStatisticsComponent = () => {
  return (
    <div className="flex p-4 justify-between">
      {classesStatistics?.map((item, i) => (
        <div key={i}>
          <h2
            className={`text-sm text-chart-3 font-extralight ${inter.className}`}
          >
            {item.name}
          </h2>
          <p className={`text-4xl ${inter.className}`}>{item.number}</p>
        </div>
      ))}
    </div>
  );
};

export default ClassesStatisticsComponent;
