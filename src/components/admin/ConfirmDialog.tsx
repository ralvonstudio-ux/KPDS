import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

/**
 * Promise-based confirm dialog — call `confirm(options)` and await the
 * boolean result, instead of a jarring native window.confirm().
 * Usage: const { confirm, dialog } = useConfirm(); render {dialog} once.
 */
export function useConfirm() {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);

  const confirm = (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });

  const dialog = state && (
    <Modal open onClose={() => { state.resolve(false); setState(null); }} title={state.title} width="max-w-sm">
      <p className="text-sm text-muted">{state.description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            state.resolve(false);
            setState(null);
          }}
        >
          Cancel
        </Button>
        <Button
          variant={state.destructive ? "primary" : "gold"}
          size="sm"
          className={state.destructive ? "bg-red-700 hover:bg-red-800" : undefined}
          onClick={() => {
            state.resolve(true);
            setState(null);
          }}
        >
          {state.confirmLabel ?? "Confirm"}
        </Button>
      </div>
    </Modal>
  );

  return { confirm, dialog };
}
