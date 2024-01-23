import { useEffect, useState } from "react";
import axios from "axios";
import noticeBackground from "./img/notice-default.png";
import { MobileStepper } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

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
            <div
              className="h-full w-full bg-cover"
              style={{ backgroundImage: `url(${background})` }}
            >
              <h1 className="text-base-100 bg-gradient-to-tl from-transparent via-transparent to-base-300 w-max">
                {notice.title}
              </h1>
            </div>
          </div>
        );
      })
    : null;

  return (
    <div>
      <div className="notice-background flex flex-col justify-center items-center">
        <div className="overflow-x-hidden flex flex-col justify-end flex-wrap w-5/6 h-4/6 relative">
          {noticesDisplay}
          <MobileStepper
            sx={{ bgcolor: "transparent", color: "#e5e7eb", zIndex: 1 }}
            variant="dots"
            steps={notices.length}
            position="static"
            activeStep={noticeID}
            backButton={
              <button
                disabled={noticeID === 0}
                onClick={() => setNoticeID((prev) => prev - 1)}
              >
                <KeyboardArrowLeft />
              </button>
            }
            nextButton={
              <button
                disabled={noticeID === notices.length - 1}
                onClick={() => setNoticeID((prev) => prev + 1)}
              >
                <KeyboardArrowRight />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
