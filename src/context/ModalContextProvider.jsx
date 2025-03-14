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
                appElement={document.body}
            >
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    )
}

export const useModalContext = () => useContext(ModalContext);