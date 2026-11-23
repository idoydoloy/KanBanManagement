"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, type MemberFormValues } from "@/lib/validation/member-schema";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (values: MemberFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  divisionName: string;
}

export function AddMemberDialog({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
  divisionName,
}: AddMemberDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "password123",
      role: "member",
    },
  });

  const onSubmit = async (values: MemberFormValues) => {
    const success = await onAdd(values);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Anggota Divisi"
      description={`Daftarkan anggota baru ke dalam tim ${divisionName}.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="member-name" required>
            Nama Lengkap
          </Label>
          <Input
            id="member-name"
            placeholder="Contoh: Budi Santoso"
            error={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="member-email" required>
            Email Perusahaan
          </Label>
          <Input
            id="member-email"
            type="email"
            placeholder="nama@kanban.com"
            error={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="member-password">
            Password Awal
          </Label>
          <Input
            id="member-password"
            type="password"
            placeholder="Minimal 6 karakter (default: password123)"
            error={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-heading uppercase tracking-wider"
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Anggota"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
