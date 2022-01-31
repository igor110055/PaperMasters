import {FC} from "react";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {accountsArr, requestMetaMaskAccount} from "../../features/CreateSlice";
import {Button} from "@chakra-ui/react";

export const TestSaga: FC = () => {
    const dispatch = useAppDispatch();

    return <div>Test <Button onClick={() => {  console.log("DISPATCH"); dispatch(requestMetaMaskAccount())}}>Click Me</Button></div>
}

export default TestSaga;