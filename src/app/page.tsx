import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
// import { useEffect } from "react";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Connections } from "./_components/connections";
import { SummonerStats } from "~/server/api/routers/connections";
export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">U</span>Ranked
        </h1>
        {/* <Connections /> */}
        <LeagueRank />
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function LeagueRank() {
  const refresh = await api.post.getRefresh.query();
  if (!refresh.access_token || !refresh.refresh_token) return null;
  const summonerStats = await api.connections.getConnections
    .query({
      access_token: refresh.access_token,
      refresh_token: refresh.refresh_token,
    })
    .then((res) => res.connections);
  if (summonerStats) {
    const soloDuo = summonerStats.find(
      (summoner) => summoner.queueType === "RANKED_SOLO_5x5",
    );
    const flex = summonerStats.find(
      (summoner) => summoner.queueType === "RANKED_FLEX_SR",
    );
    let soloDuoRank = "Unranked";
    let flexRank = "Unranked";
    if (soloDuo) {
      soloDuoRank = `${soloDuo.tier} ${soloDuo.rank}`;
    }
    if (flex) {
      flexRank = `${flex.tier} ${flex.rank}`;
    }
    return (
      <div>
        <h1>Solo/Duo</h1>
        <p>{soloDuoRank}</p>
        <h1>Flex</h1>
        <p>{flexRank}</p>
      </div>
    );
    // const rank = connection
    // return <div></div>;
  }
  return (
    <div>
      <h1>please connect your Riot ID to Discord!</h1>
    </div>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  // const connections = await api.user.getConnections.query();
  // console.log(connections);
  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
