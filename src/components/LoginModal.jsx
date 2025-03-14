import Modal from "react-modal";
import {useState} from "react";
import {Button} from "./Button.jsx";

export const LoginModal = () => {
    return (
        <form>
            <input name={'login'} type={'text'}/>
            <input name={'password'} type={'password'}/>
            <Button>Войти</Button>
        </form>
    )
}