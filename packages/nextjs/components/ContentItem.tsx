import React from "react";
import Content from "./Content";
import BuyContent from "~~/components/BuyContent";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function ContentItem({ contentId }: { contentId: number }) {
  const { data: hasAccess } = useScaffoldReadContract({
    contractName: "ContentMarketplace",
    functionName: "checkAccess",
    args: [BigInt(contentId)],
  });

  if (hasAccess === undefined) return <div>error</div>;
  return hasAccess ? <Content contentId={contentId} /> : <BuyContent contentId={contentId} />;
}
