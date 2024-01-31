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
  const [infomation, setInfomation] = useState<infomation[] | null>(null);
  console.log(infomation);
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
        setInfomation([
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

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="bg-base-300 m-5 text-lg">
        Please note that this website is for display purposes only. The content
        and information provided on this site are not intended to be accurate,
        up-to-date, or applicable in real-world scenarios.
      </h1>
      <h1 className="text-3xl my-5">Contact Us</h1>
      <div className="w-72">
        <div className="text-xl">Business Hours:</div>
        <div className="text-xl">12:00 AM to 10:00 PM</div>
        <div className="text-sm my-4">
          Please note that these hours are subject to change and may vary during
          holidays or special occasions.
        </div>
      </div>
    </div>
  );
}
