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
        <p>Please try again later.</p>
        <p>
          Please contact shop owner at boardousell@boardousell.com if you keep
          encounter this error.
        </p>
        <button className="btn btn-error" onClick={() => handleError()}>
          Back
        </button>
      </DialogContent>
    </Dialog>
  );
}
