export const BACKENDURL: string =
  process.env.NODE_ENV === "production"
    ? "https://boardousell-backend.fly.dev"
    : "http://localhost:3000";
export const DISCLAIMER = (
  <h1 className="bg-base-300 m-5 text-lg">
    Please note that this website is for display purposes only. The content and
    information provided on this site are not intended to be accurate,
    up-to-date, or applicable in real-world scenarios.
  </h1>
);
