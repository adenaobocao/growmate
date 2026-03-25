"use client";

import { useState } from "react";
import Link from "next/link";
import { EditProfileForm } from "./edit-profile-form";
import { ManageSubscriptionButton } from "./manage-subscription-button";

interface SettingsClientProps {
  profileName: string | null;
  email: string;
  plan: "FREE" | "PRO";
}

export function SettingsClient({ profileName, email, plan }: SettingsClientProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      {/* Profile card */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center text-lg flex-shrink-0">
            {profileName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-grow-text truncate">
              {profileName || "Usuario"}
            </div>
            <div className="text-[11px] text-grow-muted truncate">{email}</div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="text-[10px] font-bold text-grow-primary hover:text-grow-primary/80 transition-colors"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Plan card */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
              Plano atual
            </div>
            <div className="text-sm font-bold text-grow-text mt-1">
              {plan === "PRO" ? (
                <span className="text-grow-primary">PRO</span>
              ) : (
                "Gratuito"
              )}
            </div>
            <div className="text-[10px] text-grow-muted mt-1">
              {plan === "FREE"
                ? "1 planta, 10 msgs/dia"
                : "6 plantas, msgs ilimitadas"}
            </div>
          </div>
          {plan === "FREE" ? (
            <Link
              href="/upgrade"
              className="btn-primary px-4 py-2 text-[11px] no-underline"
            >
              Fazer upgrade
            </Link>
          ) : (
            <ManageSubscriptionButton />
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      {editOpen && (
        <EditProfileForm
          name={profileName}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
