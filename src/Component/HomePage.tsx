import { useEffect, useState } from "react";
import axios from "axios";
import noticeBackground from "./img/notice-default.png";

const BACKENDURL = process.env.REACT_APP_BACKEND;
interface noticeDetail {
  id: number;
  title: string;
  url: string | null;
  detail: string;
  createdAt: Date;
  updatedAt: Date;
}

type notice = noticeDetail[];
export default function HomePage() {
  const [notices, setNotices] = useState<notice>([]);
  const [noticeID, setNoticeID] = useState<number>(0);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const noticesRes = await axios.get(BACKENDURL + `/notice/newest`);
        setNotices(noticesRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotice();
  }, []);

  const noticesDisplay: React.ReactNode | null = !!notices.length
    ? notices.map((notice, i) => {
        const background = notice.url === null ? noticeBackground : notice.url;
        return (
          <div
            className="absolute h-full w-full"
            key={notice.id}
            style={{ left: `${(i - noticeID) * 100}%` }}
          >
            <img className="h-full bg-cover w-full" src={background} />
          </div>
        );
      })
    : null;

  return (
    <div>
      <div className="notice-background flex justify-center items-center">
        <div className="overflow-x-scroll flex flex-col flex-wrap w-5/6 h-5/6 relative">
          {noticesDisplay}
        </div>
      </div>
    </div>
  );
}
