import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
interface Connection {
  id: string;
  name: string;
  type: string;
  friend_sync: boolean;
  metadata_visibility: number;
  show_activity: boolean;
  two_way_link: boolean;
  verified: boolean;
  visibility: number;
}
interface accountv1 {
  puuid: string;
  gameName: string;
  tagLine: string;
}
interface summonerv4 {
  id: string;
}
interface streak {
  target: number;
  wins: number;
  losses: number;
  progress: string;
}

export interface SummonerStats {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  miniSeries?: streak; // MiniSeries is optional
}

type ConnectionData = Connection[];
export const connections = createTRPCRouter({
  getConnections: publicProcedure
    .input(z.object({ access_token: z.string(), refresh_token: z.string() }))
    .query(async ({ input }) => {
      const url = "https://discord.com/api/users/@me/connections";
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${input.access_token}`,
        },
      });

      const reader = res.body?.getReader();
      if (reader === undefined) return { error: "reader is null" };
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        result += decoder.decode(value);
      }
      const parsed: ConnectionData = JSON.parse(result) as ConnectionData;
      let league: Connection | undefined = undefined;
      if (parsed !== undefined) {
        league = parsed.find((connection) => {
          if (connection.type === "riotgames") return true;
          return false;
        });
      }
      if (league !== undefined) {
        // console.log(league);
        const leagueName = league.name.split("#");
        const tagLine = leagueName[1];
        const gameName = leagueName[0];
        let url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
        const res = await fetch(url, {
          headers: {
            "X-Riot-Token": env.RIOT_API_KEY,
          },
        });
        const reader = res.body?.getReader();
        if (reader === undefined) return { error: "reader is null" };
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          result += decoder.decode(value);
        }
        const parsed = JSON.parse(result) as accountv1;
        url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${parsed.puuid}`;
        const res2 = await fetch(url, {
          headers: {
            "X-Riot-Token": env.RIOT_API_KEY,
          },
        });
        const reader2 = res2.body?.getReader();
        if (reader2 === undefined) return { error: "reader is null" };
        const decoder2 = new TextDecoder();
        let result2 = "";
        while (true) {
          const { done, value } = await reader2.read();
          if (done) {
            break;
          }
          result2 += decoder2.decode(value);
        }
        const parsed2 = JSON.parse(result2) as summonerv4;
        // console.log(parsed2);
        url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${parsed2.id}`;
        const res3 = await fetch(url, {
          headers: {
            "X-Riot-Token": env.RIOT_API_KEY,
          },
        });
        const reader3 = res3.body?.getReader();
        if (reader3 === undefined) return { error: "reader is null" };
        const decoder3 = new TextDecoder();
        let result3 = "";
        while (true) {
          const { done, value } = await reader3.read();
          if (done) {
            break;
          }
          result3 += decoder3.decode(value);
        }
        const parsed3 = JSON.parse(result3) as SummonerStats[];
        // console.log(parsed3);
        return {
          connections: parsed3,
        };
      }

      return {
        connections: undefined,
      };
    }),
});
