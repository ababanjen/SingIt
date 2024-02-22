import { useEffect, useState } from "react";
import Image from "next/image";
import HeartIcon from "./icons/heart";
import { useTYPlayerStore } from "../store/YTP";
import useOnSelectPlay from "../hooks/useOnSelectPlay";
import { isEmpty, isNull } from "lodash";

const ItemCard = ({ item }: { item: any }) => {
  const [isFav, setIsFave] = useState<boolean>(false);
  const {
    setSuccessReservation,
    successReservation,
    queues,
    setQueues,
    setFavorites,
    favorites,
  } = useTYPlayerStore();
  const onSelectPlay = useOnSelectPlay();

  useEffect(() => {
    if (successReservation) {
      setTimeout(() => setSuccessReservation(null), 3000);
    }
  }, [successReservation]);

  useEffect(() => {
    if (favorites) {
      setIsFave(favorites.some((f: any) => f.id.videoId === item.id.videoId));
    } else {
      const favQueues = JSON.parse(localStorage.getItem("favQueues") || '""');
      if (!isEmpty(favQueues)) setFavorites(favQueues);
    }
  }, [favorites]);

  const addToQueuee = () => {
    const queue = isNull(queues) ? 0 : queues.length;
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const newReserved = { singer: "unknown", videoId, title, queue };
    const newQueues = queues ? [...queues, newReserved] : [newReserved];
    localStorage.setItem("queues", JSON.stringify(newQueues));
    setQueues(newQueues);
    setSuccessReservation(item);
    if (!queues) {
      onSelectPlay({ videoId, title, queue });
      return;
    }
  };

  const addAsFavorite = () => {
    const favQueues = JSON.parse(localStorage.getItem("favQueues") || '""');
    let fav = isEmpty(favQueues) ? [item] : [...favQueues, item];
    if (isFav) {
      fav = favQueues?.filter((f: any) => f.id.videoId !== item.id.videoId);
    } else {
      fav = isEmpty(favQueues) ? [item] : [...favQueues, item];
    }

    localStorage.setItem("favQueues", JSON.stringify(fav));
    setFavorites(fav);
  };

  return (
    <div className="bg-[#EEEEEE] hover:bg-[#D9D9D9] px-4 py-2 gap-2 flex w-full">
      <div className="overflow-hidden  flex w-40">
        <Image
          width={100}
          height={100}
          src={item.snippet.thumbnails.default.url}
          alt="thumbnail"
          loader={() => item.snippet.thumbnails.default.url}
        />
      </div>
      <div className="flex flex-col gap-2 w-[-webkit-fill-available]">
        <span className="flex flex-col">
          <span
            className="font-semibold text-sm line-clamp-1"
            dangerouslySetInnerHTML={{ __html: item.snippet.title }}
          />
        </span>
        <div className="flex items-end justify-between w-full">
          <a
            className="bg-[#1A3271] px-4 p-1 text-sm cursor-pointer hover:bg-[#162C64] text-white"
            onClick={addToQueuee}
          >
            Reserve
          </a>
          <span className="cursor-pointer" onClick={addAsFavorite}>
            <HeartIcon active={isFav} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;