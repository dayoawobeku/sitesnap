import {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}

export default function Modal({
  isOpen,
  children,
  className,
  onClose,
}: ModalProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-full min-h-screen items-start justify-center p-[12vh] text-center backdrop-blur-sm">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`${className} flex w-full transform flex-col text-left align-middle transition-all`}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
