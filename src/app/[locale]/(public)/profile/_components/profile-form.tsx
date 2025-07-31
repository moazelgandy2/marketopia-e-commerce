// app/[locale]/profile/_components/profile-form.tsx
"use client";

import { UserType } from "@/types/auth";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserRoleType } from "@/types/auth";
import { Edit3, Save, X } from "lucide-react";

type Props = { user: UserType };

const roleColors: Record<UserRoleType, string> = {
  [UserRoleType.USER]: "bg-blue-100 text-blue-800",
  [UserRoleType.DELIVERYMAN]: "bg-orange-100 text-orange-800",
};

export function ProfileForm({ user }: Props) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email || "",
    phone: user.phone || "",
  });

  const handleSave = async () => {
    // PUT /ar/api/profile
    await fetch("/ar/api/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEdit(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
      {/* Avatar & badges */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src={
            user.image
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
              : "/images/default-avatar.jpg"
          }
          alt={user.name}
          width={96}
          height={96}
          className="rounded-full border-4 border-purple-300 dark:border-purple-600"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={roleColors[user.user_type]}>
              {user.user_type}
            </Badge>
            <Badge
              variant={user.status === "active" ? "default" : "destructive"}
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-4">
        <div>
          <Label>Full Name</Label>
          <Input
            value={form.name}
            disabled={!edit}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            disabled={!edit}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            type="tel"
            value={form.phone}
            disabled={!edit}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {edit ? (
          <>
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEdit(false);
                setForm({
                  name: user.name,
                  email: user.email || "",
                  phone: user.phone || "",
                });
              }}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={() => setEdit(true)}
          >
            <Edit3 className="w-4 h-4 mr-1" /> Edit
          </Button>
        )}
      </div>

      {/* Quick links */}
      <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
        <Button
          variant="outline"
          asChild
        >
          <a href="/orders">My Orders</a>
        </Button>
        <Button
          variant="outline"
          asChild
        >
          <a href="/settings">Settings</a>
        </Button>
      </div>
    </div>
  );
}
