import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const DeleteConfirmOverlay = ({
  displayName,
  isDeleting,
  deleteError,
  onConfirm,
  onCancel,
}: {
  displayName: string;
  isDeleting: boolean;
  deleteError: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 z-10">
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/40">
        <Trash size={20} className="text-red-500" />
      </div>
      <p className="text-sm font-semibold text-center">Supprimer {displayName} ?</p>
      <p className="text-xs text-muted-foreground text-center">
        Cette action est irréversible. Tous les élèves associés seront désaffectés.
      </p>
    </div>
    {deleteError && (
      <p className="text-xs text-destructive text-center">{deleteError}</p>
    )}
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={onCancel}
        disabled={isDeleting}
      >
        Annuler
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="flex-1"
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? <Spinner /> : "Supprimer"}
      </Button>
    </div>
  </div>
);

export default DeleteConfirmOverlay;
