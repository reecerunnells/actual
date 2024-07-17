import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { undo, redo, addNotification } from 'loot-core/client/actions';
import { type Notification } from 'loot-core/client/state-types/notifications';

type UndoNotification = Pick<
  Notification,
  'type' | 'title' | 'message' | 'messageActions' | 'pre'
>;

type RedoNotification = Pick<
  Notification,
  'type' | 'title' | 'message' | 'messageActions' | 'pre'
>;

type UndoActions = {
  undo: ReturnType<typeof undo>;
  redo: ReturnType<typeof redo>;
  showUndoNotification: (undoNotification: UndoNotification) => void;
  showRedoNotification: (redoNotification: RedoNotification) => void;
};

export function useUndo(): UndoActions {
  const dispatch = useDispatch();

  const dispatchUndo = useCallback(async () => {
    await dispatch(undo());
  }, [dispatch]);

  const dispatchRedo = useCallback(async () => {
    await dispatch(redo());
  }, [dispatch]);

  const showUndoNotification = useCallback(
    ({
      type = 'message',
      title,
      message,
      messageActions,
      pre,
    }: UndoNotification) => {
      dispatch(
        addNotification({
          type,
          title,
          message,
          messageActions,
          pre,
          sticky: true,
          button: {
            title: 'Undo',
            action: dispatchUndo,
          },
        }),
      );
    },
    [dispatch, dispatchUndo],
  );

  const showRedoNotification = useCallback(
    ({
      type = 'message',
      title,
      message,
      messageActions,
      pre,
    }: RedoNotification) => {
      dispatch(
        addNotification({
          type,
          title,
          message,
          messageActions,
          sticky: true,
          pre,
          button: {
            title: 'Redo',
            action: dispatchRedo,
          },
        }),
      );
    },
    [dispatch, dispatchRedo],
  );

  return {
    undo: dispatchUndo,
    redo: dispatchRedo,
    showUndoNotification,
    showRedoNotification,
  };
}
