import { useEffect, useState } from "react";
import axios from "axios";
import noticeBackground from "../img/notice-default.png";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { MobileStepper } from "@mui/material";
import { Link } from "react-router-dom";
import { BACKENDURL } from "../../constant";
import { notice } from "../../type";

type animation = "next" | "prev" | "reset" | null;

export default function NoticeSlide({ setError }: { setError: Function }) {
  const [notices, setNotices] = useState<notice[]>([]);
  const [currentNotice, setCurrentNotice] = useState<number>(0);
  const [startAnimation, setStartAnimation] = useState<animation>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const noticesRes = await axios.get(`${BACKENDURL}/notice/`);
        setNotices(noticesRes.data);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load notices.",
        });
      }
    };
    fetchNotice();
  }, [setError]);

  useEffect(() => {
    const autoSwipe = () => {
      if (currentNotice === notices.length - 1) {
        setStartAnimation("reset");
        setCurrentNotice(0);
      } else {
        setStartAnimation("next");
        setCurrentNotice((prev) => prev + 1);
      }
    };
    const timer = setInterval(() => {
      autoSwipe();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [currentNotice, notices.length]);

  const animationReset = `@keyframes reset-notice{
    0%{transform:translate(-${(notices.length - 1) * 100}%);}
    100%{transform:translate(0);}
  }`;

  const animationNext = `@keyframes next-notice{
    0%{transform:translate(-${(currentNotice - 1) * 100}%);}
    100%{transform:translate(-${currentNotice * 100}%);}
  }`;

  const animationPrev = `@keyframes prev-notice{
    0%{transform:translate(-${(currentNotice + 1) * 100}%);}
    100%{transform:translate(-${currentNotice * 100}%);}
  }`;

  const handleNext = () => {
    setStartAnimation("next");
    setCurrentNotice((prev) => prev + 1);
  };
  const handlePrev = () => {
    setStartAnimation("prev");
    setCurrentNotice((prev) => prev - 1);
  };

  const noticesDisplay = notices.map((notice, i) => {
    const background = notice.url === null ? noticeBackground : notice.url;
    let animationName = "none";
    switch (startAnimation) {
      case "next":
        animationName = "next-notice";
        break;
      case "prev":
        animationName = "prev-notice";
        break;
      case "reset":
        animationName = "reset-notice";
        break;
    }
    return (
      <div
        className="absolute h-full w-full "
        key={i}
        style={{
          left: `${i * 100}%`,
          transform: `translate(-${currentNotice * 100}%)`,
          animationName: animationName,
          animationDuration: "0.5s",
        }}
        onAnimationEnd={() => setStartAnimation(null)}
      >
        <Link to={`/notice/${notice.id}`}>
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          >
            <h1 className="text-base-300 pl-2 pt-1 text-base-content bg-gradient-to-tl from-base-300 to-transparent w-max">
              {notice.title}
            </h1>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div>
      <style>
        {animationNext} {animationPrev} {animationReset}
      </style>
      <div className="notice-background h-48 sm:h-80 justify-center items-center relative">
        <div className="overflow-x-hidden flex flex-col justify-end flex-wrap h-full relative">
          {noticesDisplay}
        </div>{" "}
        <MobileStepper
          className="absolute bottom-0 flex justify-center bg-base-300"
          sx={{
            bgcolor: "transparent",
            zIndex: 1,
          }}
          variant="dots"
          steps={notices.length}
          position="static"
          activeStep={currentNotice}
          backButton={
            <button
              onClick={handlePrev}
              className={`relative bg-primary rounded-full -left-12 w-8 h-8  ${
                currentNotice === 0 && "invisible"
              }`}
            >
              <KeyboardArrowLeft className="text-base-300" />
            </button>
          }
          nextButton={
            <button
              className={`relative bg-primary rounded-full  -right-12 w-8 h-8  ${
                currentNotice === notices.length - 1 && "invisible"
              }`}
              onClick={handleNext}
            >
              <KeyboardArrowRight className="text-base-300" />
            </button>
          }
        />
      </div>
    </div>
  );
}
