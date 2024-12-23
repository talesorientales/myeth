import React from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function BuyContent({ contentId }: { contentId: number }) {
  const { data: price } = useScaffoldReadContract({
    contractName: "ContentMarketplace",
    functionName: "getPrice",
    args: [BigInt(contentId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "ContentMarketplace",
  });

  const handleBuyContent = async () => {
    if (price) {
      await writeContractAsync({
        functionName: "buyContent",
        args: [BigInt(contentId)],
        value: BigInt(price),
      });
    }
  };

  return (
    <>
      <div>
        <p className="font-semibold m-0">ID: {contentId}</p>
        <p className="text-sm text-gray-600">Price: {Number(price)} wei</p>
      </div>
      <button
        onClick={handleBuyContent}
        className="w-full py-2 px-4 mt-4 text-white font-semibold rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Buy Content
      </button>
    </>
  );
}
