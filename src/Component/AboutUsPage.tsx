import GoogleMap from "./AboutUs-Sub/GoogleMap";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <GoogleMap location={"觀塘巧明工業大廈88樓8A室"} />
    </div>
  );
}
