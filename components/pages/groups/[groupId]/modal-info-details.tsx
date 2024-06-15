"use client";

import toast from "react-hot-toast";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { Earth, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { update } from "@/actions/group";
import { useGroupContext } from "@/providers/group-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
} from "@/components/ui/form";
import SelectActions, { ISelectAction } from "@/components/select-actions";
import CustomEditor from "@/components/custom-editor";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const actions: ISelectAction[] = [
  { label: "Công khai", value: "1", icon: Earth },
  { label: "Riêng tư", value: "0", icon: Lock },
];

const formSchema = z.object({
  group_name: z.string().min(5).max(20),
  status: z.boolean().nullable().optional(),
  approve_members: z.boolean().nullable().optional(),
  approve_posts: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
});

const ModalInfoDetails = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const { groupData } = useGroupContext();

  const { mutate, isPending } = useMutation({
    mutationKey: ["group", "update", groupData.id],
    mutationFn: update,
    onSuccess(res) {
      toast.success("Cập nhật thông tin nhóm thành công");
      router.refresh();
      onOpenChange(false);
    },
    onError() {
      toast.error("Cập nhật thất bại. Vui lòng thử lại sau");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: groupData?.group_name || "",
      status: groupData?.status,
      approve_members: groupData?.approve_members,
      approve_posts: groupData?.approve_posts,
      description: groupData?.description,
    },
  });

  const disabled = useMemo(() => {
    const name = form.getValues("group_name");
    return !name || isPending;
  }, [form, isPending]);

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (!clerkUser || !groupData) return;
      // console.log(values);
      mutate({
        groupId: groupData.id,
        data: { ...values },
      });
    },
    [clerkUser, groupData]
  );
  const onInValid = useCallback((errors: any) => {
    Object.keys(errors).forEach((key) => {
      const message = errors?.[key]?.message || "";
      if (!message) return;
      toast.error(message);
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhóm</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 h-full flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInValid)}
              className="h-full flex flex-col items-stretch space-y-4"
            >
              <div className="flex-1 pb-2 overflow-hidden overflow-y-auto">
                <div className="h-full flex flex-col gap-2">
                  {/* Input Name */}
                  <div className="w-full flex items-end space-x-2">
                    <FormField
                      name="group_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tên người dùng</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên người dùng"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quyền riêng tư</FormLabel>
                          <FormControl>
                            <SelectActions
                              className="w-full col-span-3"
                              actions={actions}
                              defaultValue={field.value ? "1" : "0"}
                              onChange={(val) => field.onChange(!!+val)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Input rules */}
                  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-2">
                    Kiểm duyệt
                  </div>
                  <Separator className="my-2" />
                  <div className="w-full flex space-x-2">
                    <FormField
                      name="approve_members"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={field.name}
                                checked={field.value!}
                                onCheckedChange={field.onChange}
                              />
                              <label
                                htmlFor={field.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Người dùng
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="approve_posts"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={field.name}
                                checked={field.value!}
                                onCheckedChange={field.onChange}
                              />
                              <label
                                htmlFor={field.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Bài viết
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Mô tả nhóm</FormLabel>
                        <FormControl>
                          <CustomEditor
                            data={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="h-fit w-full flex items-center justify-end gap-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
                <Button disabled={disabled}>Lưu thay đổi</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInfoDetails;
