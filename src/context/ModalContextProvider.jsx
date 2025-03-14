import Modal from "react-modal";
import {createContext, useContext, useState} from "react";

const ModalContext = createContext(null);

export const ModalContextProvider = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    }
    const closeModal = () => setIsModalOpen(false);

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                appElement={document.getElementById('root')}
                className="bg-[#303e54] rounded-xl px-10 py-6 animate-fadeInUp"
                overlayClassName="overflow-y-auto fixed p-20 inset-0 bg-black/[.4]"
                bodyOpenClassName="scroll-auto overflow-hidden"
                portalClassName="w-full"
            >
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    )
}

export const useModalContext = () => useContext(ModalContext);