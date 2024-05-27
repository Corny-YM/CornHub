"use client";

import toast from "react-hot-toast";
import { Earth, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { store } from "@/actions/group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectActions, { ISelectAction } from "@/components/select-actions";

interface Props {
  children: React.ReactNode;
}

const actions: ISelectAction[] = [
  { label: "Công khai", value: "1", icon: Earth },
  { label: "Riêng tư", value: "0", icon: Lock },
];

const ModalCreate = ({ children }: Props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState(actions[0].value);

  const { mutate, isPending } = useMutation({
    mutationKey: ["groups", "store"],
    mutationFn: store,
    onSuccess(res) {
      toast.success("Tạo nhóm thành công");
      if (res) router.push(`/groups/${res.id}`);
      else router.push("/groups");
    },
    onError() {
      toast.error("Tạo nhóm thất bại. Vui lòng thử lại sau");
    },
  });

  const isDisabled = useMemo(
    () => !name || !status || isPending,
    [name, status, isPending]
  );

  const handleInputChange = useCallback((e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setName(value);
  }, []);

  const handleSelectChange = useCallback((val: string) => {
    setStatus(val);
  }, []);

  const handleCreateGroup = useCallback(() => {
    if (!name || !status) return;
    mutate({ name, status });
  }, [name, status]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo nhóm</DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập dữ liệu nhóm của bạn ở đây. Nhấp vào lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label className="text-right col-span-2">Tên nhóm</Label>
            <Input
              id="name"
              placeholder="CornyGroup"
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label className="text-right col-span-2">Quyền riêng tư</Label>
            <SelectActions
              className="w-full col-span-3"
              actions={actions}
              defaultValue={status}
              onChange={handleSelectChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isDisabled} size="sm" onClick={handleCreateGroup}>
            Thao tác
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreate;
