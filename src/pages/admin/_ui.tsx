import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-strong rounded-2xl p-5 md:p-6 ${className}`}>{children}</div>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-2.5 outline-none transition text-sm";

export function PrimaryBtn({
  children, loading, ...props
}: { children: ReactNode; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`bg-gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl neon-glow hover:scale-[1.02] transition-transform disabled:opacity-60 inline-flex items-center justify-center gap-2 text-sm ${props.className ?? ""}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function GhostBtn({
  children, ...props
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`glass rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/5 transition ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function DangerBtn({
  children, ...props
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-destructive/15 text-destructive border border-destructive/30 rounded-xl px-4 py-2 text-sm font-medium hover:bg-destructive/25 transition ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export async function uploadToBucket(file: File, folder: string): Promise<string | null> {
  const { supabase } = await import("@/integrations/supabase/client");
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return data.publicUrl;
}