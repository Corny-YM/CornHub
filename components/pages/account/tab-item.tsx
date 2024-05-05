"use client";

import { useAccountContext } from "@/providers/account-provider";
import Posts from "./posts";
import Images from "./images";
import Videos from "./videos";
import Friends from "./friends";
import Introduction from "./introduction";

const TabItem = () => {
  const { tabs, selectedTab } = useAccountContext();

  // Introduction
  if (selectedTab === tabs[1].id) return <Introduction />;
  // Friends
  if (selectedTab === tabs[2].id) return <Friends />;
  // Images
  if (selectedTab === tabs[3].id) return <Images />;
  // Videos
  if (selectedTab === tabs[4].id) return <Videos />;
  // Posts
  return <Posts />;
};

export default TabItem;
