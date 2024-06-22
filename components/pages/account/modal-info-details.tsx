"use client";

import toast from "react-hot-toast";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { UserDetail } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { update } from "@/actions/user";
import { genderOptions, relationOptions } from "@/lib/const";
import { useAccountContext } from "@/providers/account-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import DatePicker from "@/components/date-picker";
import InputSelect from "@/components/input-select";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const formSchema = z.object({
  full_name: z.string().min(5).max(50),
  gender: z.string().nullable().optional(),
  biography: z.string().max(50).nullable().optional(),
  work: z.string().max(50).nullable().optional(),
  education: z.string().max(50).nullable().optional(),
  living: z.string().max(50).nullable().optional(),
  country: z.string().max(50).nullable().optional(),
  relationship: z.string().max(50).nullable().optional(),
  portfolio: z.string().max(50).nullable().optional(),
  birth: z.date().nullable().optional(),
});

const ModalInfoDetails = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const { accountData } = useAccountContext();

  const { full_name, userDetails } = accountData;

  const { mutate, isPending } = useMutation({
    mutationKey: ["user", "update", "details", accountData.id],
    mutationFn: update,
    onSuccess(res) {
      toast.success("Cập nhật thông tin cá nhân thành công");
      router.refresh();
      onOpenChange(false);
    },
    onError() {
      toast.error("Cập nhật thất bại. Vui lòng thử lại sau");
    },
  });

  const infoDetails = useMemo(() => {
    const result = userDetails?.[0] as UserDetail | undefined;
    return result;
  }, [userDetails]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: full_name || "",
      gender: infoDetails?.gender ? infoDetails?.gender + "" : "",
      biography: infoDetails?.biography,
      work: infoDetails?.work,
      education: infoDetails?.education,
      living: infoDetails?.living,
      country: infoDetails?.country,
      relationship: infoDetails?.relationship,
      portfolio: infoDetails?.portfolio,
      birth: infoDetails?.birth!,
    },
  });

  const disabled = useMemo(() => {
    const name = form.getValues("full_name");
    return !name || isPending;
  }, [form.getValues("full_name"), isPending]);

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (!clerkUser) return;
      // console.log(values);
      mutate({ ...values, birth: form.getValues("birth")?.toISOString() });
    },
    [clerkUser]
  );
  const onInValid = useCallback((errors: any) => {
    Object.keys(errors).forEach((key) => {
      const message = errors?.[key]?.message || "";
      if (!message) return;
      toast.error(message);
    });
  }, []);

  const handleResetName = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!clerkUser?.fullName) return;
      form.setValue("full_name", clerkUser.fullName);
    },
    [clerkUser]
  );

  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChange(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trang cá nhân</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="h-[80vh] flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInValid)}
              className="h-full flex flex-col space-y-4"
            >
              <div className="h-full space-y-2 -mx-4 px-4 overflow-hidden overflow-y-auto">
                {/* Input Name */}
                <div className="w-full flex items-end space-x-2">
                  <FormField
                    name="full_name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Tên người dùng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên người dùng" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleResetName}
                  >
                    <RotateCcw />
                  </Button>
                </div>

                {/* Input Gender & Birth */}
                <div className="flex items-center space-x-2">
                  <FormField
                    name="gender"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <InputSelect
                            placeholder="Chọn giới tính"
                            options={genderOptions}
                            value={field.value!}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="birth"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value!}
                            onChange={(date) => field.onChange(date)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Relation & Portfolio */}
                <div className="flex items-center space-x-2">
                  <FormField
                    name="relationship"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Mối quan hệ</FormLabel>
                        <FormControl>
                          <InputSelect
                            placeholder="Chọn tình trạng MQH"
                            options={relationOptions}
                            value={field.value!}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="portfolio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Trang Web</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. https://example.com"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Work & Education */}
                <div className="flex items-center space-x-2">
                  <FormField
                    name="work"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Công việc</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. cornhub"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="education"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Học vấn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. eaut"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Living & Country */}
                <div className="flex items-center space-x-2">
                  <FormField
                    name="living"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Tỉnh/Thành phố hiện tại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. cornhub"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quê quán</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. eaut"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Biography */}
                <FormField
                  name="biography"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiểu sử</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tiểu sử"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex items-center justify-end gap-x-2">
                <Button variant="outline" onClick={handleCancel}>
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
