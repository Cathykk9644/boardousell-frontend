export default function WrongPage(): JSX.Element {
  return (
    <div className="flex flex-col p-8">
      <h1 className="text-2xl self-center">Sorry, the page cannot be found.</h1>
      <p className="self-center">
        If you encounter this issue during normal usage, please contact the shop
        owner to resolve it.
      </p>
    </div>
  );
}
