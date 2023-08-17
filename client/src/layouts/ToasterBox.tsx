import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { toastSelector } from "../utils/selectors";
import { remove } from "../features/toastSlice";
import Toaster from "../components/Misc/Toaster";

const ToasterBox: React.FC = () => {
  const { toasts } = useSelector(toastSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toasts.length) {
      setTimeout(() => {
        // @ts-ignore
        dispatch(remove(toasts.at(-1).id));
      }, 3000);
    }
  }, [toasts]);

  return toasts.length
    ? createPortal(
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-10"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            {toasts.map(({ error, message, id }) => {
              return <Toaster key={id} hasError={error} text={message} />;
            })}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default ToasterBox;
