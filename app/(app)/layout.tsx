import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const couple = await getMyCouple(supabase).catch(() => null);

  return (
    <div className="flex min-h-screen bg-paper">
      {couple && <Sidebar coupleLabel={couple.couple_code} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
