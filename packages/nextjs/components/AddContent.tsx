import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function AddContent() {
  const [price, setPrice] = useState("");
  const [uri, setUri] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "ContentMarketplace",
  });

  const handleAddContent = async () => {
    if (price && uri) {
      await writeContractAsync({
        functionName: "addContent",
        args: [BigInt(price), uri],
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Add Content</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="price">
          Price (in wei)
        </label>
        <input
          type="number"
          id="price"
          placeholder="Price in wei"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="uri">
          Content URI
        </label>
        <input
          type="text"
          id="uri"
          placeholder="Content URI"
          value={uri}
          onChange={e => setUri(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleAddContent}
        className={`w-full py-2 px-4 mt-4 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        Add Content
      </button>
    </div>
  );
}
