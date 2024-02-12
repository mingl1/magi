"use client";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

export async function Connections() {
  const [connections, setConnections] = useState("");
  // const session = await getServerAuthSession();
  // if (!session?.user) return null;
  // const router = useRouter();

  // const refresh = await api.post.getRefresh.useQuery();
  // setConnections(refresh);

  return <div>{connections}</div>;
}
// async function getConnections() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       {/* <CreatePost /> */}
//     </div>
//   );
// }
