import { toast, TOAST } from './toastify';

const copyToClipboard = (text, successMessage, errorMessage = 'There was a problem') => {
    global.window.navigator.clipboard.writeText(text)
    .then(() => {
      toast(successMessage, { type: TOAST.TYPE.SUCCESS });
    })
    .catch(() => {
      toast(errorMessage, { type: TOAST.TYPE.ERROR });
    });
};

export default copyToClipboard;
