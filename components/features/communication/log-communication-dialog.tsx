"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CommunicationService, LogCommunicationDto } from "@/lib/communication.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  status: z.enum(["ANSWERED", "NO_ANSWER", "PROMISE_TO_PAY", "FAILED"]),
  notes: z.string().optional(),
  promiseToPayDate: z.string().optional(),
});

interface LogCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  customerName: string;
  onSuccess: () => void;
}

export function LogCommunicationDialog({
  open,
  onOpenChange,
  loanId,
  customerName,
  onSuccess,
}: LogCommunicationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "ANSWERED",
      notes: "",
      promiseToPayDate: "",
    },
  });

  const status = form.watch("status");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.status === "PROMISE_TO_PAY" && !values.promiseToPayDate) {
      form.setError("promiseToPayDate", { message: "Vui lòng chọn ngày hứa trả" });
      return;
    }

    setIsSubmitting(true);
    try {
      await CommunicationService.log({
        loanId,
        type: "OVERDUE_REMINDER",
        channel: "PHONE_CALL",
        status: values.status as any,
        notes: values.notes,
        promiseToPayDate: values.status === "PROMISE_TO_PAY" ? values.promiseToPayDate : undefined,
        subject: `Nhắc nợ qua điện thoại - ${values.status === "PROMISE_TO_PAY" ? "Hứa trả" : "Kết quả: " + values.status}`
      });
      
      toast.success("Đã lưu nhật ký cuộc gọi");
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu nhật ký");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ghi nhận cuộc gọi</DialogTitle>
          <DialogDescription>
            Khách hàng: <span className="font-semibold text-foreground">{customerName}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kết quả cuộc gọi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kết quả" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ANSWERED">Đã nghe máy (Answered)</SelectItem>
                      <SelectItem value="NO_ANSWER">Không nghe máy (No Answer)</SelectItem>
                      <SelectItem value="PROMISE_TO_PAY">Hứa trả nợ (Promise to Pay)</SelectItem>
                      <SelectItem value="FAILED">Thuê bao / Lỗi (Failed)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status === "PROMISE_TO_PAY" && (
              <FormField
                control={form.control}
                name="promiseToPayDate"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2">
                    <FormLabel className="text-blue-600">Ngày hứa trả</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ghi lại nội dung cuộc trao đổi..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Lưu kết quả
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
