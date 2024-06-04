"use client";

import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { Group, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { searching } from "@/actions/user";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AvatarImg from "@/components/avatar-img";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import Link from "next/link";
import EmptyData from "./empty-data";
import Loading from "./icons/loading";

interface Props {
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (val: boolean) => void;
}

const SearchModal = ({ open, children, onOpenChange }: Props) => {
  const { userId } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroup] = useState<Group[]>([]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["user", "searching", userId],
    mutationFn: searching,
    onSuccess(res) {
      setUsers(res.users);
      setGroup(res.groups);
    },
    onError() {
      toast.error("Tìm kiếm thất bại. Vui lòng thử lại sau");
    },
  });

  useDebounce(
    () => {
      if (!inputValue) return;
      mutate({ searchKey: inputValue, limit: 5 });
    },
    250,
    [inputValue]
  );

  const onChange = useCallback((e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    setInputValue(val);
  }, []);

  const contentUsers = useMemo(() => {
    if (!users.length) return null;
    return (
      <div className="mt-2">
        <div>Người dùng</div>
        <div>
          {users.map((user) => (
            <Link
              key={user.email}
              className="w-full flex items-center p-2 rounded-lg cursor-pointer hover:bg-primary-foreground/50"
              href={`/account/${user.id}`}
            >
              <AvatarImg className="mr-2" src={user.avatar} />
              <div>{user.full_name}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }, [users]);

  const contentGroups = useMemo(() => {
    if (!groups.length) return null;
    return (
      <div className="mt-2">
        <div>Nhóm</div>
        <div>
          {groups.map((group) => (
            <Link
              key={group.id}
              className="w-full flex items-center p-2 rounded-lg cursor-pointer hover:bg-primary-foreground/50"
              href={`/groups/${group.id}`}
            >
              <AvatarImg className="mr-2" src={group.cover} isGroup />
              <div>{group.group_name}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }, [groups]);

  const content = useMemo(() => {
    if (isPending)
      return (
        <div className="w-full flex items-center justify-center mt-4">
          <Loading />
        </div>
      );
    if (!contentUsers && !contentGroups && !isPending)
      return <EmptyData className="mt-4" />;
    return (
      <>
        {contentUsers}
        {contentGroups}
      </>
    );
  }, [groups, users, isPending]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className="z-[99999]" />
      <DialogContent className="z-[99999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-x-2 select-none">
              Tìm kiếm trên <Badge className="text-base">CornHub</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="h-full max-h-full flex flex-col">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Nhập tên người dùng hoặc tên nhóm"
              value={inputValue}
              onChange={onChange}
            />
            <Button variant="outline" type="submit">
              Tìm kiếm
            </Button>
          </div>
          {content}
        </div>

        {onOpenChange && (
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
