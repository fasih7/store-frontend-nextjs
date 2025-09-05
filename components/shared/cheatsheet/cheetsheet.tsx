// app/cheatsheet/page.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const cheatSheetItems = [
  {
    title: "Alerts",
    description: "Custom and default alert styles",
    href: "/cheatsheet/alerts",
    isActive: true,
  },
  {
    title: "Tables",
    description: "Responsive, styled tables",
    href: "/cheatsheet/tables",
  },
  {
    title: "Forms",
    description: "Input, select, and validation UI",
    href: "/cheatsheet/forms",
  },
];

export default function CheatSheetPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">UI Cheat Sheet</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cheatSheetItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
