import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "./_ui";

type Log = {
  id: string;
  user_email: string | null;
  action: string;
  entity: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export default function ActivityLogAdmin() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setLogs((data as Log[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <PageHeader title="Activity Log" description={`Last ${logs.length} admin actions`} />
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border/50">
              <tr>
                <th className="text-left p-3">When</th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Entity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border/30 last:border-0">
                  <td className="p-3 whitespace-nowrap text-muted-foreground">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 truncate max-w-[200px]">{l.user_email ?? "—"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{l.entity ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}