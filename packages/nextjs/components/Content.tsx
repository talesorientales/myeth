import React from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function Content({ contentId }: { contentId: number }) {
  const { data: uri } = useScaffoldReadContract({
    contractName: "ContentMarketplace",
    functionName: "getContent",
    args: [BigInt(contentId)],
  });

  if (!uri) {
    return <></>;
  }
  return (
    <>
      <div>
        <p className="font-semibold m-0">ID: {contentId}</p>
        <p className="text-sm text-gray-600">URI: {uri}</p>
      </div>
      <a
        target="_blank"
        href={uri}
        className="block w-full py-2 px-4 mt-4 text-white text-center bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        View Content
      </a>
    </>
  );
}
