"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Camera,
  Images,
  Trash2,
  Upload,
  Settings2,
  CircleCheck,
} from "lucide-react";

import { removeAvatar, update } from "@/actions/user";
import { useToggle } from "@/hooks/useToggle";
import { useAppContext } from "@/providers/app-provider";
import { useAccountContext } from "@/providers/account-provider";
import DropdownActions, {
  IDropdownAction,
} from "@/components/dropdown-actions";
import AlertModal from "@/components/alert-modal";
import NoAvatar from "@/public/no-avatar.jpg";
import ModalFiles from "./modal-files";

const InfoAvatar = () => {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const { accountData, isOwner } = useAccountContext();

  const [isSelecting, setIsSelecting] = useState(false);
  const [modalFiles, toggleModalFiles] = useToggle(false);
  const [modalConfirm, toggleModalConfirm] = useToggle(false);
  const [file, setFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(accountData?.avatar);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["account", "update", "avatar", accountData],
    mutationFn: update,
    onSuccess(res) {
      toast.success("Cập nhật ảnh đại diện thành công");
      router.refresh();
      window.location.reload();
      setFile(null);
      setAvatar(res?.avatar);
      setIsSelecting(false);
    },
    onError() {
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại sau");
    },
  });

  const { mutate: mutateRemoveAvatar, isPending: isPendingRemoveAvatar } =
    useMutation({
      mutationKey: ["account", "update", "avatar", accountData],
      mutationFn: removeAvatar,
      onSuccess() {
        toast.success("Xóa ảnh đại diện thành công");
        router.refresh();
        window.location.reload();
        setFile(null);
        setAvatar(null);
        setIsSelecting(false);
      },
      onError() {
        toast.error("Xóa ảnh đại diện thất bại. Vui lòng thử lại sau");
      },
    });

  const disabled = useMemo(
    () => isPendingUpdate || isPendingRemoveAvatar,
    [isPendingUpdate, isPendingRemoveAvatar]
  );

  const isShowEdit = useMemo(() => {
    if (file) return false;
    else if (avatar && isSelecting) return false;
    return true;
  }, [file, avatar, isSelecting]);

  const actions = useMemo(() => {
    const result: IDropdownAction[] = [
      {
        label: "Chọn ảnh đại diện",
        icon: <Images className="mr-2" />,
        onClick: () => toggleModalFiles(true),
      },
      {
        label: "Tải ảnh lên",
        icon: <Upload className="mr-2" />,
        onClick: () => inputFileRef.current?.click(),
      },
    ] as IDropdownAction[];
    if (!accountData.avatar?.includes("clerk.com"))
      result.push({
        label: "Gỡ",
        destructive: true,
        icon: <Trash2 className="mr-2" />,
        onClick: () => toggleModalConfirm(true),
      });
    return result;
  }, [accountData, currentUser]);

  const handleSelectImage = useCallback((url: string) => {
    setAvatar(url);
    setIsSelecting(true);
  }, []);

  const handleChangeFile = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFile(file);
    setAvatar(previewUrl);
  }, []);

  const handleUpdateAvatar = useCallback(() => {
    if (currentUser?.id !== accountData.id) return;
    mutateUpdate({ avatar: file || avatar });
  }, [file, accountData, avatar, currentUser]);

  const handleRemovePreviewAvatar = useCallback(() => {
    if (currentUser?.id !== accountData.id) return;
    setFile(null);
    setIsSelecting(false);
    setAvatar(accountData?.avatar);
  }, [accountData, currentUser]);

  const handleRemoveAvatar = useCallback(() => {
    if (currentUser?.id !== accountData.id) return;
    mutateRemoveAvatar();
  }, [accountData, currentUser]);

  return (
    <div className="absolute left-4 bottom-2">
      <div className="relative w-40 h-40 flex justify-center items-center rounded-full overflow-hidden border border-solid border-neutral-900/50">
        <Image
          className="absolute w-full h-full"
          src={avatar || NoAvatar}
          alt={accountData.full_name || "account-avatar"}
          fill
          sizes="w-40"
        />
      </div>
      <div className="absolute bottom-1 right-1">
        {isOwner &&
          (isShowEdit ? (
            <DropdownActions
              align="start"
              disabled={disabled}
              actions={actions}
              icon={<Camera size={20} />}
            />
          ) : (
            <>
              <DropdownActions
                align="start"
                disabled={disabled}
                actions={[
                  {
                    label: "Lưu",
                    icon: <CircleCheck className="mr-2" size={20} />,
                    onClick: handleUpdateAvatar,
                  },
                  {
                    label: "Bỏ",
                    destructive: true,
                    icon: <Trash2 className="mr-2" size={20} />,
                    onClick: handleRemovePreviewAvatar,
                  },
                ]}
                icon={<Settings2 size={20} />}
              />
            </>
          ))}

        <input
          ref={inputFileRef}
          hidden
          multiple={false}
          style={{ display: "none" }}
          accept="image/*"
          type="file"
          onChange={handleChangeFile}
        />

        <AlertModal
          destructive
          open={modalConfirm}
          onClick={handleRemoveAvatar}
          onOpenChange={toggleModalConfirm}
        />

        <ModalFiles
          open={modalFiles}
          onOpenChange={toggleModalFiles}
          onSelect={handleSelectImage}
        />
      </div>
    </div>
  );
};

export default InfoAvatar;
