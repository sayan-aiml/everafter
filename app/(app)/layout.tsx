import { createClient } from "@/lib/supabase/server";
import { getMyCouple } from "@/lib/services/couples";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AICompanionDrawer } from "@/components/ai/AICompanionDrawer";


export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const userResult = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const user = userResult?.data?.user;

  const couple = (await getMyCouple(supabase).catch(() => null)) ?? {
    id: "demo-couple-id",
    couple_code: "LOVE-EVERAFTER",
    invite_code: "JOIN-99X21",
    anniversary_date: "2023-02-14",
    status: "active",
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-paper text-ink">
      <MobileNav coupleLabel={couple.couple_code} />
      <Sidebar coupleLabel={couple.couple_code} />
      <div className="flex-1 pb-24 md:pb-8 overflow-x-hidden">{children}</div>
      <AICompanionDrawer />
    </div>
  );
}


