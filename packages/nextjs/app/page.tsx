"use client";

import type { NextPage } from "next";
import AddContent from "~~/components/AddContent";
import ContentList from "~~/components/ContentList";

const Home: NextPage = () => {
  return (
    <>
      <AddContent />
      <ContentList />
    </>
  );
};

export default Home;
