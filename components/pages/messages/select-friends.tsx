import { X } from "lucide-react";
import { User } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { IDispatchState } from "@/types";
import { getFriends } from "@/actions/user";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/icons/loading";
import AvatarImg from "@/components/avatar-img";
import EmptyData from "@/components/empty-data";

interface Props {
  open: boolean;
  params?: Record<string, any>;
  selectedIds: Record<string, User>;
  setSelectedIds: IDispatchState<Record<string, User>>;
}

const SelectFriends = ({
  open,
  params,
  selectedIds,
  setSelectedIds,
}: Props) => {
  const { userId } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const { data, isLoading } = useQuery({
    enabled: open && !!userId,
    queryKey: ["user", "friends", userId, searchKey, params],
    queryFn: () => getFriends(userId!, { limit: 10, searchKey, ...params }),
  });

  useDebounce(() => setSearchKey(inputValue), 250, [inputValue]);

  const handleSearch = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);
  }, []);

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
            <div className="flex flex-col gap-2">{contentSelectedFriends}</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SelectFriends;
