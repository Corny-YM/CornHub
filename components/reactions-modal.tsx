"use client";

import { Group, Post, User, File as IFile } from "@prisma/client";

interface Props {
  data: Post & { user: User; group: Group | null; file: IFile | null };
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val: boolean) => void;
}

const ReactionsModal = ({ data, open, children, onOpenChange }: Props) => {
  return <div>ReactionsModal</div>;
};

export default ReactionsModal;
