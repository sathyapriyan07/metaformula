"use client";
import dynamic from "next/dynamic";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ChartWrapper = dynamic(() => Promise.resolve(ChartComponent), { ssr: false });

function ChartComponent({ data, dataKey, title }: { data: any[]; dataKey: string; title: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: 12 }} />
          <YAxis stroke="#ffffff40" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#fff",
            }}
          />
          <Bar dataKey={dataKey} fill="rgba(255, 255, 255, 0.3)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartWrapper;

export function DriverStatsChart({ driver }: { driver: any }) {
  const data = [
    { name: "Championships", value: driver.championships || 0 },
    { name: "Wins", value: driver.wins || 0 },
    { name: "Podiums", value: driver.podiums || 0 },
    { name: "Poles", value: driver.poles || 0 },
    { name: "Fastest Laps", value: driver.fastest_laps || 0 },
  ];

  return <ChartWrapper data={data} dataKey="value" title="Career Statistics" />;
}
