import { useEffect, useState } from "react";
import GoogleMap from "./ContactUs-Sub/GoogleMap";
import axios from "axios";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type infomation = {
  name: "Link" | "Map" | "Email" | "Phone";
  detail: string;
};
type hash = {
  [key: string]: infomation[];
};

export default function ContactUsPage() {
  const [infomations, setInfomations] = useState<infomation[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: infomation[] } = await axios.get(
          `${BACKENDURL}/infomation`
        );
        const hashInfo: hash = {};
        for (const info of data) {
          if (!hashInfo[info.name]) {
            hashInfo[info.name] = [info];
          } else {
            hashInfo[info.name].push(info);
          }
        }
        setInfomations([
          ...hashInfo["Phone"],
          ...hashInfo["Email"],
          ...hashInfo["Link"],
          ...hashInfo["Map"],
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const infoDisplay = infomations?.map((info: infomation) => {
    switch (info.name) {
      case "Phone":
        return (
          <div key={info.detail}>
            Phone:{" "}
            <a href={`tel:${info.detail}`} className="link">
              {info.detail}
            </a>
          </div>
        );
      case "Email":
        return (
          <div key={info.detail}>
            Email:{" "}
            <a href={`mailto:${info.detail}`} className="link">
              {info.detail}
            </a>
          </div>
        );
      case "Link":
        return (
          <div key={info.detail}>
            Link:{" "}
            <a href={`${info.detail}`} className="link">
              {info.detail}
            </a>
          </div>
        );
      case "Map":
        return (
          <div key={info.detail} className=" flex flex-col m-5">
            <GoogleMap location={info.detail} />
            <b className="self-center">Address: {info.detail}</b>
          </div>
        );
    }
  });
  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="bg-base-300 m-5 text-lg">
        Please note that this website is for display purposes only. The content
        and information provided on this site are not intended to be accurate,
        up-to-date, or applicable in real-world scenarios.
      </h1>
      <h1 className="text-3xl my-5 self-center">Contact Us</h1>
      <div className="mx-5">
        <div className="text-xl">Business Hours:</div>
        <div className="text-xl">12:00 AM to 10:00 PM</div>
        <div className="text-sm my-4">
          Please note that these hours are subject to change and may vary during
          holidays or special occasions.
        </div>
      </div>
      <div className="mx-5 ">{infoDisplay} </div>
    </div>
  );
}
