import {useAppContext} from "../context/AppContextProvider.jsx";
import {useState} from "react";
import {CloseButton, Dialog, Portal, Button, Input, Field} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {PasswordInput} from "./ui/password-input.jsx";

export const LoginModal = () => {
    const {pb, setUser} = useAppContext();
    const [open, setOpen] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (values) => {
        const authResult = await pb.collection('users').authWithPassword(
            values['login'],
            values['password'],
        );

        if (authResult.token) {
            setOpen(false);
            setUser(authResult.record);
        }
    }

    return (
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => {
            setOpen(e.open)
        }}>
            <Dialog.Trigger asChild>
                <Button colorPalette={'blue'} rounded={'lg'}>Вход</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Вход</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col gap-3'}>
                                <Field.Root required>
                                    <Field.Label>
                                        Логин <Field.RequiredIndicator/>
                                    </Field.Label>
                                    <Input
                                        placeholder={'Логин'}
                                        {...register('login', {required: true})}
                                        aria-invalid={errors.login ? "true" : "false"}
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>
                                        Пароль <Field.RequiredIndicator/>
                                    </Field.Label>
                                    <PasswordInput
                                        placeholder={'Пароль'}
                                        {...register('password', {required: true})}
                                        aria-invalid={errors.password ? "true" : "false"}
                                    />
                                </Field.Root>
                                <Button type={'submit'} colorPalette={'blue'} rounded={'lg'}>Войти</Button>
                            </form>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm"/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}