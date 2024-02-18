import axios from "axios";
import { useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";
import NoticeSlide from "./NoticeSlide";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useOutletContext, useParams, Params } from "react-router-dom";
import { notice } from "../../type";

export default function NoticePage(): JSX.Element {
  const [noticeList, setNoticeList] = useState<notice[]>([]);
  const { noticeId } = useParams<Params>();
  const [currentNoticeId, setCurrentNoticeId] = useState<number | null>(
    noticeId ? Number(noticeId) : null
  );
  const { setError }: { setError: Function } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BACKENDURL}/notice`);
        setNoticeList(data);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Sorry, cannot load notices for now.",
        });
      }
    };
    fetchData();
  }, [setError]);

  useEffect(() => {
    setCurrentNoticeId(Number(noticeId));
  }, [noticeId]);

  const handleExpand = async (noticeId: number) => {
    setCurrentNoticeId((prev) => (prev === noticeId ? null : noticeId));
  };

  const listDisplay = noticeList.map((notice) => {
    return (
      <Accordion
        key={notice.id}
        expanded={notice.id === currentNoticeId}
        onChange={() => {
          handleExpand(notice?.id);
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="flex flex-col">
            <div className="self-start">{notice.createdAt.slice(0, 10)}</div>
            <span> {notice?.title}</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="card">
            {notice.url && <img src={notice.url} alt={notice.title} />}
            <div className="card-body">{notice.detail}</div>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  });
  return (
    <div className="min-h-screen flex flex-col">
      <NoticeSlide setError={setError} />
      <h1 className="m-2">All Notices:</h1>
      <div className="sm:w-5/6 self-center">{listDisplay}</div>
    </div>
  );
}
