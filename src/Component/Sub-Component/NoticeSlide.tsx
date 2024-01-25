import { useEffect, useState } from "react";
import axios from "axios";
import noticeBackground from "../img/notice-default.png";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { MobileStepper } from "@mui/material";
const BACKENDURL = process.env.REACT_APP_BACKEND;
interface noticeDetail {
  title: string;
  url: string | null;
}

type notice = noticeDetail[];
type animation = "next" | "prev" | "reset" | null;

export default function NoticeSlide() {
  const [notices, setNotices] = useState<notice>([]);
  const [noticeID, setNoticeID] = useState<number>(0);
  const [startAnimation, setStartAnimation] = useState<animation>(null);

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

  useEffect(() => {
    const autoSwipe = () => {
      if (noticeID === notices.length - 1) {
        setStartAnimation("reset");
        setNoticeID(0);
      } else {
        setStartAnimation("next");
        setNoticeID((prev) => prev + 1);
      }
    };
    const timer = setInterval(() => {
      autoSwipe();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [noticeID, notices.length]);

  const animationReset = `@keyframes reset-notice{
    0%{transform:translate(-${(notices.length - 1) * 100}%);}
    100%{transform:translate(0);}
  }`;

  const animationNext = `@keyframes next-notice{
    0%{transform:translate(-${(noticeID - 1) * 100}%);}
    100%{transform:translate(-${noticeID * 100}%);}
  }`;

  const animationPrev = `@keyframes prev-notice{
    0%{transform:translate(-${(noticeID + 1) * 100}%);}
    100%{transform:translate(-${noticeID * 100}%);}
  }`;

  const handleNext = () => {
    setStartAnimation("next");
    setNoticeID((prev) => prev + 1);
  };
  const handlePrev = () => {
    setStartAnimation("prev");
    setNoticeID((prev) => prev - 1);
  };

  const noticesDisplay: React.ReactNode | null = !!notices.length
    ? notices.map((notice, i) => {
        const background = notice.url === null ? noticeBackground : notice.url;
        return (
          <div
            className="absolute h-full w-full "
            key={i}
            style={{
              left: `${i * 100}%`,
              transform: `translate(-${noticeID * 100}%)`,
              animationName:
                startAnimation === "next"
                  ? "next-notice"
                  : startAnimation === "prev"
                  ? "prev-notice"
                  : startAnimation === "reset"
                  ? "reset-notice"
                  : "none",
              animationDuration: "0.5s",
            }}
            onAnimationEnd={() => setStartAnimation(null)}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${background})` }}
            >
              <h1 className="pl-2 pt-1 text-base-content bg-gradient-to-tl from-base-300 to-transparent w-max">
                {notice.title}
              </h1>
            </div>
          </div>
        );
      })
    : null;

  return (
    <div>
      <style>
        {animationNext} {animationPrev} {animationReset}
      </style>
      <div className="notice-background h-48 sm:h-80 justify-center items-center sm:items-start">
        <div className="overflow-x-hidden flex flex-col justify-end flex-wrap w-72 h-5/6 sm:w-96 sm:m-10 relative">
          {noticesDisplay}
          <MobileStepper
            className="flex justify-center"
            sx={{
              bgcolor: "transparent",
              zIndex: 1,
            }}
            variant="dots"
            steps={notices.length}
            position="static"
            activeStep={noticeID}
            backButton={
              <button
                onClick={handlePrev}
                className={noticeID === 0 ? "invisible" : ""}
              >
                <KeyboardArrowLeft className="text-base-300" />
              </button>
            }
            nextButton={
              <button
                className={noticeID === notices.length - 1 ? "invisible" : ""}
                onClick={handleNext}
              >
                <KeyboardArrowRight className="text-base-300" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
