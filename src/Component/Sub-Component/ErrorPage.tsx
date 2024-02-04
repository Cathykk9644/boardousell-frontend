import { Dialog, DialogContent, DialogTitle } from "@mui/material";

type props = {
  error: { backHome: boolean; message: string } | null;
  handleError: Function;
};
export default function ErrorPage({ error, handleError }: props) {
  return (
    <Dialog open={!!error} onClose={() => handleError()}>
      <DialogTitle>{error?.message}</DialogTitle>
      <DialogContent className="flex flex-col items-center space-y-5">
        <p>
          Please contact shopowner at boardousell@boardousell.com if you need
          help.
        </p>
        <button className="btn btn-error" onClick={() => handleError()}>
          Back
        </button>
      </DialogContent>
    </Dialog>
  );
}
