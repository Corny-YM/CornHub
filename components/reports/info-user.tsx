"use client";

import { Report } from "@prisma/client";

interface Props {
  id: string;
  data: Report;
  enabled?: boolean;
}

const InfoUser = ({ id }: Props) => {
  return <div>InfoUser</div>;
};

export default InfoUser;
