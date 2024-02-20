import { useEffect, useState } from "react";
import GoogleMap from "./GoogleMap";
import axios from "axios";
import { DISCLAIMER } from "../../constant";
import { useOutletContext } from "react-router-dom";
import { infomation } from "../../type";
import { BACKENDURL } from "../../constant";

type hash = {
  [K in infomation["name"]]: infomation[];
};

export default function ContactUsPage(): JSX.Element {
  const [infomations, setInfomations] = useState<infomation[]>([]);
  const { setError }: { setError: Function } = useOutletContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: infomation[] } = await axios.get(
          `${BACKENDURL}/infomation`
        );
        const hashInfo: hash = { Email: [], Link: [], Map: [], Phone: [] };
        for (const info of data) {
          hashInfo[info.name]!.push(info);
        }
        setInfomations([
          ...hashInfo["Phone"],
          ...hashInfo["Email"],
          ...hashInfo["Link"],
          ...hashInfo["Map"],
        ]);
      } catch (error) {
        setError({
          backHome: true,
          message: "Oh. Somethings went wrong. Cannot load infomation.",
        });
      }
    };
    fetchData();
  }, [setError]);

  const infoDisplay = infomations.map((info: infomation) => {
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
            <GoogleMap location={info.detail} setError={setError} />
            <b className="self-center">Address: {info.detail}</b>
          </div>
        );
      default:
        return null;
    }
  });
  return (
    <div className="min-h-screen flex flex-col">
      {DISCLAIMER}
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
