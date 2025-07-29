import React from "react";
import { useSettings } from "../hooks/settingsContext";
import { Bookmark } from "../utils/types";
import BookmarkWidget from "./Bookmark";

const Bookmarks: React.FC = () => {
  const { settings } = useSettings();
  const bookmarks: Bookmark[] = settings?.bookmarks || [];
  return (
    <>
      {bookmarks.map((bm: Bookmark, index: number) => {
        return <BookmarkWidget key={bm.id} index={index} bookmark={bm} />;
      })}
    </>
  );
};

export default Bookmarks;
