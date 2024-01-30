import { useState } from "react";
import GoogleMap from "./ContactUs-Sub/GoogleMap";

type infomation = {
  name: string;
  detail: string;
};

export default function ContactUsPage() {
  const [infomation, setInfomation] = useState<infomation[] | null>(null);
  // <GoogleMap location={} />

  return (
    <div className="min-h-screen flex flex-col items-center">
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
