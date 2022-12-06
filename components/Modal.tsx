import {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';

interface TransitionParent {
  children: React.ReactNode;
  className: string;
}

function TransitionParent({children, className}: TransitionParent) {
  return <div className={className}>{children}</div>;
}

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  padding?: string;
  transitionParentClassName?: string;
  navAnimation?: boolean;
}

export default function Modal({
  isOpen,
  children,
  className,
  onClose,
  transitionParentClassName,
  navAnimation,
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
            <TransitionParent
              className={`flex h-full min-h-screen items-start justify-center px-4 text-center backdrop-blur-sm ${
                transitionParentClassName
                  ? transitionParentClassName
                  : 'pt-20 md:p-[12vh]'
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter={`${
                  navAnimation
                    ? 'ease-in-out duration-500'
                    : 'ease-out duration-300'
                }`}
                enterFrom={`opacity-0 ${
                  navAnimation ? '-translate-y-10' : 'scale-95'
                }`}
                enterTo={`opacity-100 ${navAnimation ? '' : 'scale-100'}`}
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo={`opacity-0 ${
                  navAnimation ? ' translate-y-20' : 'scale-95'
                }`}
              >
                <Dialog.Panel
                  className={`${className} flex w-full transform flex-col text-left align-middle transition-all`}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </TransitionParent>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
