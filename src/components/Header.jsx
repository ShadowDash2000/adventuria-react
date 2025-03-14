import {Button} from "./Button.jsx";
import {Avatar} from "./Avatar.jsx";
import Undefined from '/src/assets/undefined.jpg'
import {LoginModal} from "./LoginModal.jsx";
import {useModalContext} from "../context/ModalContextProvider.jsx";

export const Header = () => {
    const {openModal} = useModalContext();

    return (
        <header className="flex justify-between items-end mt-1 px-10 pt-5">
            <div className="flex ml-1.8 gap-4">
                <Button style={'bg-blue'} onClick={() => openModal(<LoginModal/>)}>Вход</Button>
                <Button style={'bg-green'}>Правила</Button>
            </div>
            <div>
                <Avatar src={Undefined}/>
            </div>
        </header>
    )
}