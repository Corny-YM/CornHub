"use client";

import toast from "react-hot-toast";
import { X } from "lucide-react";
import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getFriends } from "@/actions/user";
import { sendGroupRequest } from "@/actions/group";
import { useDebounce } from "@/hooks/useDebounce";
import { useGroupContext } from "@/providers/group-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyData from "@/components/empty-data";
import AvatarImg from "@/components/avatar-img";
import Loading from "@/components/icons/loading";

interface Props {
  open: boolean;
  children: React.ReactNode;
  onOpenChange: (val?: boolean) => void;
}

const ModalInvite = ({ children, open, onOpenChange }: Props) => {
  const { userId } = useAuth();
  const { groupData } = useGroupContext();

  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, User>>({});

  const { data, isLoading } = useQuery({
    enabled: open && !!userId,
    queryKey: ["user", "friends", userId, searchKey],
    queryFn: () =>
      getFriends(userId!, {
        limit: 10,
        searchKey,
        exceptId: groupData.owner_id,
      }),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["group", "user", "invite", "friends"],
    mutationFn: sendGroupRequest,
    onSuccess() {
      setSelectedIds({});
      onOpenChange(false);
      toast.success("Gửi yêu cầu thành công");
    },
    onError() {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau");
    },
  });

  useDebounce(() => setSearchKey(inputValue), 250, [inputValue]);

  const handleSendGroupRequest = useCallback(() => {
    const ids = Object.keys(selectedIds);
    if (!ids.length || !groupData) return;
    mutate({ ids, groupId: groupData.id });
  }, [selectedIds, groupData]);

  const handleSearch = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);
  }, []);

  const isDisabled = useMemo(
    () => !Object.keys(selectedIds).length || isPending,
    [selectedIds, isPending]
  );

  const contentFriends = useMemo(() => {
    if (isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      );
    if (!data || !data.friends.length) return <EmptyData />;
    const friends = data.friends.map((item) => {
      if (item.user_id === userId) return item.friend;
      return item.user;
    });
    return friends.map((item) => (
      <label
        key={item.id}
        htmlFor={`friend-${item.id}`}
        className="w-full flex items-center p-2 hover:bg-primary-foreground cursor-pointer transition rounded-lg"
      >
        <AvatarImg src={item.avatar} alt={item.full_name} />
        <div className="flex-1 line-clamp-1 px-2">{item.full_name}</div>
        <Checkbox
          id={`friend-${item.id}`}
          className="w-6 h-6"
          checked={!!selectedIds[item.id]}
          onCheckedChange={(checked) => {
            setSelectedIds((prev) => {
              if (checked) return { ...prev, [item.id]: item };
              const obj = { ...prev };
              delete obj[item.id];
              return obj;
            });
          }}
        />
      </label>
    ));
  }, [data, isLoading, userId, selectedIds]);

  const contentSelectedFriends = useMemo(
    () =>
      Object.keys(selectedIds).map((friendId) => {
        const friendData = selectedIds?.[friendId];
        if (!friendData) return null;
        return (
          <div key={friendId} className="w-full flex items-center">
            <AvatarImg src={friendData.avatar} alt={friendData.full_name} />
            <div className="flex-1 line-clamp-1 px-2">
              {friendData.full_name}
            </div>
            <Button
              className="rounded-full w-8 h-8"
              variant="ghost"
              size="icon"
              onClick={() =>
                setSelectedIds((prev) => {
                  const obj = { ...prev };
                  delete obj[friendId];
                  return obj;
                })
              }
            >
              <X size={20} />
            </Button>
          </div>
        );
      }),
    [selectedIds]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-screen md:max-w-[784px]">
        <DialogHeader>
          <DialogTitle>Mời bạn bè tham gia nhóm này</DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập danh sách thành viên ở đây. Nhấp vào lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="w-full flex gap-x-2">
          <div className="w-3/5">
            <Input
              placeholder="Tìm kiếm bạn bè theo tên"
              className="mb-2 focus-visible:ring-0"
              value={inputValue}
              onChange={handleSearch}
            />
            <div className="w-full flex flex-col">
              <ScrollArea className="h-96 pr-3">{contentFriends}</ScrollArea>
            </div>
          </div>
          <div className="w-2/5  py-2 bg-primary-foreground/50 rounded-lg">
            <div className="text-sm mb-4 px-3">
              Đã chọn {Object.keys(selectedIds).length || 0} người bạn
            </div>
            <div className="flex flex-col">
              <ScrollArea className="h-96 px-3">
                <div className="flex flex-col gap-2">
                  {contentSelectedFriends}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={isDisabled}
            size="sm"
            onClick={handleSendGroupRequest}
          >
            Gửi lời mời
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInvite;
