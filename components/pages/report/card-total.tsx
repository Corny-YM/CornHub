"use client";

import Link from "next/link";

import { cn, formatAmounts } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface Props {
  title: string;
  total: number;
  className?: string;
  description?: string;
  icon?: React.ReactNode;
}

const CardTotal = ({ title, icon, total, description, className }: Props) => {
  return (
    <Card className={cn("w-full flex flex-col justify-between", className)}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div>{title}</div> <Badge variant="secondary" className="p-2">{icon}</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="w-full flex items-center justify-between">
          <Badge className="flex items-center justify-center mr-2 text-xl w-10 h-10 rounded-full">
            {formatAmounts(total)}
          </Badge>
          <Button variant="link">
            <Link href="/admin">Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTotal;
