import { DISCLAIMER } from "../constant";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {DISCLAIMER}
      <h1 className="text-3xl my-5">About Us</h1>
      <p className="w-5/6 m-3">
        Boardousell is an online destination for board game enthusiasts. We
        offer a wide selection of exciting games and a seamless shopping
        experience. Our platform also connects enthusiasts worldwide for buying
        and selling second-hand board games. Join us in creating a sustainable
        and vibrant second-hand board game market. Explore, discover, and
        connect with fellow enthusiasts. Happy gaming and trading with
        Boardousell!
      </p>
    </div>
  );
}
