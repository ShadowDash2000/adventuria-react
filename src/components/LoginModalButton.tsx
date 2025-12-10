import { Input, Field, Flex, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@ui/password-input';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { Button } from '@ui/button';
import { DialogContent } from '@ui/dialog-content';

type LoginFormValues = { login: string; password: string };

export const LoginModalButton = () => {
    const { pb, refetchUser } = useAppContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const onSubmit = async (values: LoginFormValues) => {
        const authResult = await pb
            .collection('users')
            .authWithPassword(values['login'], values['password']);

        if (authResult.token) {
            await refetchUser();
        }
    };

    return (
        <Dialog.Root lazyMount unmountOnExit>
            <Dialog.Trigger asChild>
                <Button
                    colorPalette="{colors.blue}"
                    hoverColorPalette="{colors.blue.hover}"
                    rounded={'lg'}
                >
                    Вход
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <DialogContent>
                        <Dialog.Header>
                            <Dialog.Title>Вход</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex
                                as="form"
                                onSubmit={handleSubmit(onSubmit)}
                                direction="column"
                                gap={3}
                            >
                                <Field.Root required>
                                    <Field.Label>
                                        Логин <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder={'Логин'}
                                        {...register('login', { required: true })}
                                        aria-invalid={errors.login ? 'true' : 'false'}
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>
                                        Пароль <Field.RequiredIndicator />
                                    </Field.Label>
                                    <PasswordInput
                                        placeholder={'Пароль'}
                                        {...register('password', { required: true })}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                    />
                                </Field.Root>
                                <Button
                                    type={'submit'}
                                    colorPalette="{colors.blue}"
                                    hoverColorPalette="{colors.blue.hover}"
                                    rounded={'lg'}
                                >
                                    Войти
                                </Button>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </DialogContent>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
