"use client";

import { z } from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { UserDetail } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "@/components/date-picker";
import InputSelect from "@/components/input-select";

interface Props {
  open: boolean;
  onOpenChange: (val?: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(5).max(50),
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
  const { accountData } = useAccountContext();

  const { full_name, userDetails } = accountData;

  const infoDetails = useMemo(() => {
    const result = userDetails?.[0] as UserDetail | undefined;
    return result;
  }, [userDetails]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: full_name || "",
      gender: infoDetails?.gender + "",
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[9999]" />
      <DialogContent className="z-[9999] sm:w-[600px] sm:max-w-none h-[80vh] flex flex-col !ring-0 !ring-offset-0 !outline-none">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trang cá nhân</DialogTitle>
        </DialogHeader>

        {/* content */}
        <div className="flex-1 h-full flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (val) => {
                console.log(val);
              })}
              className="h-full flex flex-col items-stretch space-y-4"
            >
              <div className="flex-1 h-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên người dùng" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <InputSelect
                            placeholder="Chọn giới tính"
                            options={[
                              { label: "Nam", value: "1" },
                              { label: "Nữ", value: "0" },
                            ]}
                            value={field.value!}
                            onValueChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth"
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
              </div>
              <div className="w-full flex items-center justify-end gap-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
                <Button disabled={false} onClick={() => {}}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInfoDetails;
