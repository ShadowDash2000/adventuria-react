import {Board} from "./Board.jsx";
import {Suspense} from "react";
import {LuLoader} from "react-icons/lu";

export const Main = () => {
    return (
        <>
            <Suspense fallback={<LuLoader/>}>
                <Board/>
            </Suspense>
        </>
    )
}