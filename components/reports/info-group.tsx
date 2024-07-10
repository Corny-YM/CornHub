"use client";

import { Report } from "@prisma/client";

interface Props {
  id: number;
  data: Report;
  enabled?: boolean;
}

const InfoGroup = ({ id }: Props) => {
  return <div>InfoGroup</div>;
};

export default InfoGroup;
