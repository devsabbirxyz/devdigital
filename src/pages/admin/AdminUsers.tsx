import { useEffect, useState } from "react";
import { Trash2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn } from "./_ui";

type Profile = { id: string; email: string | null; full_name: string | null };
type RoleRow = { user_id: string; role: "admin" | "user" };

export default function AdminUsers() {
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [me, setMe] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setMe(session.user.id);
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").eq("role", "admin");
    const ids = (roles as RoleRow[] | null)?.map((r) => r.user_id) ?? [];
    if (!ids.length) { setAdmins([]); return; }
    const { data: profs } = await supabase.from("profiles").select("id, email, full_name").in("id", ids);
    setAdmins((profs as Profile[]) || []);
  };
  useEffect(() => { load(); }, []);

  const createAdmin = async () => {
    if (!email || !password) return toast.error("Email and password required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setCreating(true);
    // signUp creates user — first-admin trigger only assigns admin to FIRST user.
    // For subsequent admins we manually insert the admin role after user is created.
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) { setCreating(false); return toast.error(error.message); }
    const newUserId = data.user?.id;
    if (newUserId) {
      // Promote to admin (handle_new_user already added a 'user' role)
      const { error: roleErr } = await supabase
        .from("user_roles")
        .insert({ user_id: newUserId, role: "admin" });
      if (roleErr && !roleErr.message.includes("duplicate")) {
        toast.error("User created, but role grant failed: " + roleErr.message);
      }
    }
    setCreating(false);
    setEmail(""); setPassword("");
    toast.success("Admin invited! They must confirm their email before signing in.");
    load();
  };

  const revoke = async (userId: string) => {
    if (userId === me) return toast.error("You cannot revoke your own admin access");
    if (!confirm("Revoke admin access for this user?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Admin access revoked");
    load();
  };

  return (
    <>
      <PageHeader title="Admin Users" description="Manage who can access this dashboard." />

      <Card className="mb-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Add a new admin
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Temporary Password" hint="Min 6 characters. They can change it after sign-in.">
            <input type="password" autoComplete="new-password" value={password} maxLength={72} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="flex justify-end">
          <PrimaryBtn onClick={createAdmin} loading={creating}>Create Admin</PrimaryBtn>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold mb-4">Current Admins ({admins.length})</h3>
        <div className="space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between glass rounded-xl p-3">
              <div>
                <p className="font-medium text-sm">{a.email ?? "(no email)"}</p>
                {a.full_name && <p className="text-xs text-muted-foreground">{a.full_name}</p>}
                {a.id === me && <span className="text-[10px] text-primary font-bold">YOU</span>}
              </div>
              {a.id !== me && (
                <button onClick={() => revoke(a.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Revoke">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}