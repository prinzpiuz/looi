import { useSettings } from "../../hooks/settingsContext";
import { Bookmark } from "../../utils/types";
import BookmarkDiv from "./Bookmark";

const Bookmarks: React.FC = () => {
  const { settings } = useSettings();
  const bookmarks: Bookmark[] = settings?.bookmarks || [];
  return (
    <>
      {bookmarks.map((bm: Bookmark, index: number) => {
        return <BookmarkDiv key={bm.id} index={index} bookmark={bm} />;
      })}
    </>
  );
};

export default Bookmarks;
