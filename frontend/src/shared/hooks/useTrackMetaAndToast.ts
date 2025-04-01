import myToast from '@shared/ui/myToast';
import { reaction } from 'mobx';
import { useEffect } from 'react';

type Network = {
  message: string
  isSuccess: boolean
  isError: boolean
}

type Args = {
  network: Network;
  onError?: () => void;
  onSuccess?: () => void;
}

export const useTrackMetaAndToast = ({
  network,
  onError,
  onSuccess,
}: Args): void => {
  useEffect(() => {
    const reactionDisposer = reaction(
      () => network.message,
      (message) => {
        if (network.isError) {
          onError?.();
          if (!message) return;
          myToast(message, 'error');
        }
        if (network.isSuccess) {
          onSuccess?.();
          if (!message) return;
          myToast(message, 'success');
        }
      }
    );
  
    return () => {
      reactionDisposer();
    };
  }, [ network, onError, onSuccess ]);
};
