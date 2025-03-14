import {Button} from "./Button.jsx";
import {useAppContext} from "../context/AppContextProvider.jsx";
import {useModalContext} from "../context/ModalContextProvider.jsx";

export const LoginModal = () => {
    const {pb} = useAppContext();
    const {closeModal} = useModalContext();

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const authResult = await pb.collection('users').authWithPassword(
            formData.get('login'),
            formData.get('password'),
        );

        if (authResult.token) closeModal();
    }

    return (
        <>
            <h2 className="text-center text-6xl font-bold pb-5 uppercase">Вход</h2>
            <form onSubmit={submitHandler} className="flex flex-col items-center justify-center gap-5">
                <input placeholder={'Логин'} name={'login'} type={'text'} className="bg-white text-black rounded-sm"/>
                <input placeholder={'Пароль'} name={'password'} type={'password'}
                       className="bg-white text-black rounded-sm"/>
                <Button>Войти</Button>
            </form>
        </>
    )
}