import React from "react";
import ContentItem from "~~/components/ContentItem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function ContentList() {
  const { data: contentCount } = useScaffoldReadContract({
    contractName: "ContentMarketplace",
    functionName: "getContentCount",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Available Content</h2>
      <ul className="space-y-4">
        {Array.from({ length: Number(contentCount) }, (_, index) => (
          <li key={index} className="p-4 border border-gray-200 rounded-md shadow-sm">
            <ContentItem contentId={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}
