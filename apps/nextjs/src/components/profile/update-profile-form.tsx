"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "@acme/ui/toast";

import { useMyProfile, useUpdateMyProfile } from "~/hooks/use-user";
import { mediaApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";

const updateProfileSchema = z.object({
  username: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  avatarUrl: z.string().optional().or(z.literal("")),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfileForm() {
  const { updateUser } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: "",
      avatarUrl: "",
    },
  });

  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: UpdateProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => {
        updateUser({ username: data.username });
        toast.success("Cập nhật thông tin thành công");
      },
      onError: (error: any) => {
        toast.error(error.message || "Đã có lỗi xảy ra");
      },
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ");
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      toast.error("Kích thước file không được vượt quá 25MB");
      return;
    }

    setIsUploading(true);
    try {
      const res = await mediaApi.upload(file);
      setValue("avatarUrl", res.url, { shouldValidate: true });
      toast.success("Tải ảnh lên thành công");
    } catch (err: any) {
      toast.error(err.message || "Không thể tải ảnh lên");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border bg-card p-6 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Thông tin cá nhân
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Tên hiển thị
          </label>
          <input
            {...register("username")}
            type="text"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Tên hiển thị của bạn"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Ảnh đại diện
          </label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-muted flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl text-muted-foreground font-bold">
                  {watch("username")?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  <UploadCloud size={16} />
                  Tải ảnh lên
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Định dạng JPG, PNG, GIF (Tối đa 25MB)
              </p>
            </div>
          </div>

          <input
            {...register("avatarUrl")}
            type="hidden"
          />
          {errors.avatarUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.avatarUrl.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUpdating || isUploading}
          className="flex w-full mt-6 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          Cập nhật thông tin
        </button>
      </form>
    </div>
  );
}
